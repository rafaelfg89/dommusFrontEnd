import { useEffect, useState } from "react";
import EmpLista from "../../components/empLista";
import useFetch from "../../hooks/usefetch";


const Home = () => {
    const [emp,setEmp] = useState([]);
    const [fetching,setFetching] = useState(false);
    const [error,setError] = useState(false);

    useEffect(() => {
        setFetching(true);
        async function getData(){
            const [data,err] = await useFetch('GET',"empreendimentos")
            !!data && (setEmp(data), setFetching(false));
            !!err && setError(err)

        } getData()

    }, []);

    return <EmpLista     
        data = {emp}
        error = {error}
        fetching = {fetching}
    />
    

}

export default Home;