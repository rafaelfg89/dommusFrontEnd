import { Link, useNavigate } from "react-router-dom";



const EmpLista = (props) => {
    const {
        data,
        error,
        fetching
    } = props;

    !!error && <h1>Error</h1>
    !!fetching && <h1>Carregando</h1>
    return (
        <div className="home_container">
            <div className="titulo">
                <p>Empreendimento</p>
                <p>Localização</p>
                <p>Ação</p>
            </div>
            {
                data?.map(m => <EmpItem key={m.id} item ={m}/>)
            }
        </div>
    )
}

const EmpItem = (props) =>{    
    const navigate = useNavigate();
    const {
        id,
        nome,
        localizacao
    } = props.item;

    return (
        <div className="home_item">
          <h3 className="home_text">{nome}</h3>
          <p className="home_text">{localizacao}</p>
          <button className="btn_salvar" onClick={() => navigate(`/edit/${id}`)}>Editar</button>
        </div>
    );


}


export default EmpLista;