import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/usefetch";
const Edit = () => {
    const [emp,setEmp] = useState([]);
    const [fetching,setFetching] = useState(false);
    const [error,setError] = useState(false);

    const {id} = useParams();

    useEffect(() => {
        setFetching(true);
        async function getData(){
            const [data,err] = await useFetch('GET',`empreendimentos/${id}`)
            !!data && (setEmp(data), setFetching(false));
            !!err && setError(err)
        } getData()

    }, []);

    console.log({emp});
    !!error && <h1>Error</h1>
    !!fetching && <h1>Carregando</h1>
    return (
        
            emp > 0 ? <h1>{emp[0]?.empreendimento}</h1> : <h1>{emp?.empreendimento}</h1>
        
    )
}

export default Edit;