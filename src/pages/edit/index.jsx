import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/usefetch";


const Edit = () => {
    const [emp,setEmp] = useState([]);
    const [uni,setUni] = useState([]);
    const [fetching,setFetching] = useState(false);
    const [error,setError] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setFetching(true);
        async function getData(){
            const [dataEmp,errEmp] = await useFetch('GET',`empreendimentos/${id}`)
            !!dataEmp && (setEmp(dataEmp), setFetching(false));
            !!errEmp && setError(errEmp)
            
            const [dataUni,errUni] = await useFetch('GET',`unidade/empreendimento/${id}`)
            !!dataUni && (setUni(dataUni), setFetching(false));
            !!errUni && setError(errUni)
            
        } getData()
    }, []);

    function handlerSave() {
        
    }

    function getCardValues() {   
        const disponivel = emp?.filter((f) => f.status == "DISPONÍVEL").length > 0 ? emp
        .filter((f) => f.status == "DISPONÍVEL")
        .map((m) => m.contidade_unidade) : "0";

        const reservado = emp?.filter((f) => f.status == "RESERVADA").length > 0 ? emp
        .filter((f) => f.status == "RESERVADA")
        .map((m) => m.valor_unidade_total) : "0,00";

        const vendido = emp?.filter((f) => f.status == "VENDIDA").length > 0 ? emp
        .filter((f) => f.status == "VENDIDA")
        .map((m) => m.valor_unidade_total) : "0,00";      

        return {disponivel, reservado, vendido}
    }

    if(!!error) return <h1>Error</h1>
    if(!!fetching) return <h1>Carregando</h1>
    if(emp.length == 0) return <h1>Sem dados</h1>  
    
    const Cards = () => {
        return (
          <div className="cards">
            <div className="cards_item">
              <div className="item_card">
                <h4>Disponível</h4>
                <p>{getCardValues().disponivel} - Unidades</p>
              </div>
              <p>icon</p>
            </div>
            <div className="cards_item">
              <div className="item_card">
                <h4>Reservado</h4>
                <p>R$ {getCardValues().reservado}</p>
              </div>
              <p>icon</p>
            </div>
            <div className="cards_item">
              <div className="item_card">
                <h4>Vendido</h4>
                <p>R$ {getCardValues().vendido}</p>
              </div>
              <p>icon</p>
            </div>
          </div>
        );
    }

    const Button = () => {
        return (
          <div className="btn_container">
            <button className="btn_voltar" onClick={() => navigate("/")}>Voltar</button>
            <button className="btn_salvar">Salvar</button>
          </div>
        );
    }

    const Form = () => {
        return (
          <div className="form_container">
            <form className="form">
              <div className="item_form">
                <label htmlFor="nome">Nome</label>
                <input type="text" name="nome" id="nome" value={emp[0]?.empreendimento}/>
              </div>
              <div>
                <label htmlFor="localizacao">Localização</label>
                <input type="text" name="localizacao" id="localizacao" value={emp[0]?.localizacao}/>
              </div>
              <div>
                <label htmlFor="prev">Previsão de Entrega</label>
                <input type="date" name="prev" id="prev" value={emp[0]?.prev_entrega}/>
              </div>
            </form>
          </div>
        );
    }

    return (
      <div className="container">
        {/* EMPREENDIMENTO */}
        <div className="block">
          <h3>{emp[0]?.empreendimento}</h3>
          <Button />
          <Cards />
          <Form />
        </div>
        {/* UNIDADES */}
        <div>
          <RenderUnidades unidades={uni} />
        </div>
      </div>
    );
}

const RenderUnidades = (props) => {
    const {unidades} = props;
    const blocos = unidades.map(m => m.id_bloco);
    const blocos_dist = blocos?.filter((e, i) => blocos?.indexOf(e) === i)

    return (
        <div className="unidade">
            {
                unidades?.map(m => <UnidadeItem key={m.id} blocos={blocos_dist} item={m}/>)
            }
        </div>
    )
}

const UnidadeItem = (props) => {
    const {item,blocos} = props;    
    return (
        <div className="unidade_item">
            <p>Unidade - {item.id}</p>
            <p>Status - {item.descrição}</p>
            <p>R${item.valor}</p>
            <select defaultValue={item.id_bloco} name="" id="">
                {
                   blocos?.map(m => <option key={m} value={m}>bloco - {m}</option>) 
                }                
            </select>
            <button className="btn_salvar">Editar</button>
            <button className="btn_voltar">Excluir</button>
        </div>
    )
}
export default Edit;

