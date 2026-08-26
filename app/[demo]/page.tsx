import Demo from "../demo";
const pages=["hash","block","blockchain","distributed","tokens","coinbase","keys","signatures","transaction"];
export default async function DemoRoute({params}:{params:Promise<{demo:string}>}){const{demo}=await params;return <Demo page={pages.includes(demo)?demo:"hash"}/>}
