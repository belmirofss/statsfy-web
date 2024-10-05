import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { CHART_MASTERS_ENDPOINT } from "./constants";
import { ChartMastersArtist, ChartMastersTrack } from "./types";

const cache: Record<string, string> = {};

const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar";


const getWdtNonce = async (url: string, invalidate: boolean = false) => {
  if (!invalidate && cache[url]) {
    return cache[url];
  }

  let browser: any;
  if (process.env.NODE_ENV === "production") {
    const executablePath = await chromium.executablePath(chromiumPack);
    browser = await puppeteerCore.launch({
      executablePath,
      args: chromium.args,
      headless: true,
    });
  } else {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const inputValue = await page.evaluate(() => {
    const inputElement = document.querySelector('input[id^="wdtNonce"]');
    if (inputElement && inputElement instanceof HTMLInputElement) {
      return inputElement.value;
    }
    return null;
  });
  await browser.close();
  cache[url] = inputValue || "";
  return inputValue;
};

export const getChartMastersMostStreamedTracks = async (
  limit: number = 50,
  invalidate: boolean = false
): Promise<ChartMastersTrack[]> => {
  const wdtNonce = await getWdtNonce(
    `${CHART_MASTERS_ENDPOINT}/most-streamed-tracks-on-spotify`
  );
  const response = await fetch(
    `${CHART_MASTERS_ENDPOINT}/wp-admin/admin-ajax.php?action=get_wdtable&table_id=46`,
    {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `draw=1&columns[0][data]=0&columns[0][name]=rank&columns[0][searchable]=false&columns[0][orderable]=true&columns[0][search][value]=&columns[0][search][regex]=false&columns[1][data]=1&columns[1][name]=g#&columns[1][searchable]=false&columns[1][orderable]=true&columns[1][search][value]=&columns[1][search][regex]=false&columns[2][data]=2&columns[2][name]=Title&columns[2][searchable]=true&columns[2][orderable]=true&columns[2][search][value]=&columns[2][search][regex]=false&columns[3][data]=3&columns[3][name]=Artist&columns[3][searchable]=true&columns[3][orderable]=true&columns[3][search][value]=&columns[3][search][regex]=false&columns[4][data]=4&columns[4][name]=image_url&columns[4][searchable]=false&columns[4][orderable]=true&columns[4][search][value]=&columns[4][search][regex]=false&columns[5][data]=5&columns[5][name]=Song&columns[5][searchable]=false&columns[5][orderable]=true&columns[5][search][value]=&columns[5][search][regex]=false&columns[6][data]=6&columns[6][name]=playcount&columns[6][searchable]=false&columns[6][orderable]=true&columns[6][search][value]=&columns[6][search][regex]=false&columns[7][data]=7&columns[7][name]=dailyStreams&columns[7][searchable]=false&columns[7][orderable]=true&columns[7][search][value]=&columns[7][search][regex]=false&columns[8][data]=8&columns[8][name]=year&columns[8][searchable]=true&columns[8][orderable]=true&columns[8][search][value]=&columns[8][search][regex]=false&columns[9][data]=9&columns[9][name]=genre&columns[9][searchable]=true&columns[9][orderable]=true&columns[9][search][value]=&columns[9][search][regex]=false&columns[10][data]=10&columns[10][name]=language&columns[10][searchable]=true&columns[10][orderable]=true&columns[10][search][value]=&columns[10][search][regex]=false&order[0][column]=6&order[0][dir]=desc&start=0&length=${limit}&search[value]=&search[regex]=false&wdtNonce=${wdtNonce}`,
      next: {
        revalidate: 60 * 60, // 1 hours
      },
    }
  );

  try {
    const data = (await response.json()) as {
      draw: number;
      recordsTotal: string;
      recordsFiltered: string;
      data: string[][];
    };

    return data.data.map(
      ([
        _rank,
        _g,
        title,
        artist,
        imageUrl,
        _song,
        playcount,
        dailyStreams,
        year,
        _genre,
        _language,
      ]) => ({
        title,
        artist,
        imageUrl: imageUrl.match(/src=['"]([^'"]+)['"]/)?.[1],
        playcount,
        dailyStreams,
        year,
      })
    );
  } catch (err) {
    if (!invalidate) {
      return await getChartMastersMostStreamedTracks(limit, true);
    } else {
      return Promise.reject(err);
    }
  }
};

export const getChartMastersMostStreamedArtists = async (
  limit: number = 50,
  invalidate: boolean = false
): Promise<ChartMastersArtist[]> => {
  const wdtNonce = await getWdtNonce(
    `${CHART_MASTERS_ENDPOINT}/most-streamed-artists-ever-on-spotify`
  );
  const response = await fetch(
    `${CHART_MASTERS_ENDPOINT}/wp-admin/admin-ajax.php?action=get_wdtable&table_id=1`,
    {
      method: "POST",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `draw=1&columns[0][data]=0&columns[0][name]=rank&columns[0][searchable]=false&columns[0][orderable]=false&columns[0][search][value]=&columns[0][search][regex]=false&columns[1][data]=1&columns[1][name]=g#&columns[1][searchable]=false&columns[1][orderable]=false&columns[1][search][value]=&columns[1][search][regex]=false&columns[2][data]=2&columns[2][name]=Pic&columns[2][searchable]=false&columns[2][orderable]=false&columns[2][search][value]=&columns[2][search][regex]=false&columns[3][data]=3&columns[3][name]=ArtistNameFilter&columns[3][searchable]=true&columns[3][orderable]=false&columns[3][search][value]=&columns[3][search][regex]=false&columns[4][data]=4&columns[4][name]=Artist&columns[4][searchable]=false&columns[4][orderable]=true&columns[4][search][value]=&columns[4][search][regex]=false&columns[5][data]=5&columns[5][name]=Lead+Streams&columns[5][searchable]=false&columns[5][orderable]=true&columns[5][search][value]=&columns[5][search][regex]=false&columns[6][data]=6&columns[6][name]=Tracks&columns[6][searchable]=false&columns[6][orderable]=true&columns[6][search][value]=&columns[6][search][regex]=false&columns[7][data]=7&columns[7][name]=1b&columns[7][searchable]=false&columns[7][orderable]=true&columns[7][search][value]=&columns[7][search][regex]=false&columns[8][data]=8&columns[8][name]=100m&columns[8][searchable]=false&columns[8][orderable]=true&columns[8][search][value]=&columns[8][search][regex]=false&columns[9][data]=9&columns[9][name]=10m&columns[9][searchable]=false&columns[9][orderable]=true&columns[9][search][value]=&columns[9][search][regex]=false&columns[10][data]=10&columns[10][name]=1m&columns[10][searchable]=false&columns[10][orderable]=true&columns[10][search][value]=&columns[10][search][regex]=false&columns[11][data]=11&columns[11][name]=Feat+Streams&columns[11][searchable]=false&columns[11][orderable]=true&columns[11][search][value]=&columns[11][search][regex]=false&columns[12][data]=12&columns[12][name]=Gender&columns[12][searchable]=true&columns[12][orderable]=true&columns[12][search][value]=&columns[12][search][regex]=false&columns[13][data]=13&columns[13][name]=Language&columns[13][searchable]=true&columns[13][orderable]=true&columns[13][search][value]=&columns[13][search][regex]=false&columns[14][data]=14&columns[14][name]=Genre&columns[14][searchable]=true&columns[14][orderable]=true&columns[14][search][value]=&columns[14][search][regex]=false&columns[15][data]=15&columns[15][name]=Country&columns[15][searchable]=true&columns[15][orderable]=true&columns[15][search][value]=&columns[15][search][regex]=false&order[0][column]=5&order[0][dir]=desc&start=0&length=${limit}&search[value]=&search[regex]=false&wdtNonce=${wdtNonce}`,
      next: {
        revalidate: 60 * 60 * 8, // 8 hours
      },
    }
  );

  try {
    const data = (await response.json()) as {
      draw: number;
      recordsTotal: string;
      recordsFiltered: string;
      data: string[][];
    };

    return data.data.map(
      ([
        _rank,
        _g,
        imageUrl,
        artist,
        _artist,
        leadSteams,
        _tracks,
        _1b,
        _100m,
        _10m,
        _1m,
        _featStreams,
        _gender,
        _language,
        _genre,
        _country,
      ]) => ({
        artist,
        imageUrl: imageUrl.match(/src=['"]([^'"]+)['"]/)?.[1],
        leadSteams,
      })
    );
  } catch (err) {
    if (!invalidate) {
      return await getChartMastersMostStreamedArtists(limit, true);
    } else {
      return Promise.reject(err);
    }
  }
};
