import { getDictFromParams, Locale } from "../dictionaries";
import Login from "./Login";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const dict = await getDictFromParams(params)


    return (
        <Login dict={dict}/>
    );
}