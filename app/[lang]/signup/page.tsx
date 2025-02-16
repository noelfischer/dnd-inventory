import { getDictFromParams, Locale } from "../dictionaries";
import Signup from "./Signup";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const dict = await getDictFromParams(params)


    return (
        <Signup dict={dict}/>
    );
}