import { LogoutButton } from "./components/LogoutButton";
import { getAuthSession } from "../shared/actions/auth";
import { MyAccountContent } from "./components/MyAccountContent";
import { NotLoggedIn } from "../shared/components/NotLoggedIn";

export default async function MyAccount() {
  const session = await getAuthSession();

  return (
    <div className="flex flex-col items-center w-full">
      {session ? (
        <>
          <MyAccountContent />
          <div className="mt-8 w-full">
            <LogoutButton />
          </div>
        </>
      ) : (
        <NotLoggedIn />
      )}
    </div>
  );
}
