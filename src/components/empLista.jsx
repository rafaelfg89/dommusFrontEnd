import { Link } from "react-router-dom";


const EmpLista = (props) => {
    const {
        data,
        error,
        fetching
    } = props;

    !!error && <h1>Error</h1>
    !!fetching && <h1>Carregando</h1>
    return (
        <ul>
            {
                data?.map(m => <EmpItem key={m.id} item ={m}/>)
            }
        </ul>
    )
}

const EmpItem = (props) =>{    
    const {
        id,
        nome,
        localizacao
    } = props.item;

    return (
      <Link to={`/edit/${id}`}>
        <div>
          <h3>{nome}</h3>
          <p>{localizacao}</p>
        </div>
      </Link>
    );


}


export default EmpLista;