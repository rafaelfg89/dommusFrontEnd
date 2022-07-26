import { Layout, Image, Divider, Input, Modal, Form, Select, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/usefetch";
import {
  LoadingOutlined,
  SaveOutlined,
  LeftOutlined,
  DollarCircleOutlined,
  PlusSquareOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const statusEnum = {
     "DISPONÍVEL" :1,
     "VENDIDA"  :2,
     "RESERVADA":3 
};

const { Content } = Layout;

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
            if(!!dataEmp) {

            }
            !!errEmp && setError(errEmp)
            
            const [dataUni,errUni] = await useFetch('GET',`unidade/empreendimento/${id}`)
            !!dataUni && (setUni(dataUni), setFetching(false));
            !!errUni && setError(errUni)

        } getData()
    }, []);

    function getCardValues() {   
        const disponivel = emp?.filter((f) => f.descrição == "DISPONÍVEL").length > 0 ? emp
        .filter((f) => f.descrição == "DISPONÍVEL")
        .map((m) => m.quantidade_unidade) : "0";

        const reservado = emp?.filter((f) => f.descrição == "RESERVADA").length > 0 ? emp
        .filter((f) => f.descrição == "RESERVADA")
        .map((m) => m.valor_unidade_total) : "0,00";

        const vendido = emp?.filter((f) => f.descrição == "VENDIDA").length > 0 ? emp
        .filter((f) => f.descrição == "VENDIDA")
        .map((m) => m.valor_unidade_total) : "0,00";      

        return {disponivel, reservado, vendido}
    }

    if(!!error) return <h1>Error</h1>
    if(!!fetching) return <LoadingOutlined />
 
    
    const Cards = () => {
        return (
          <div className="cards">
            <div className="cards_item">
              <div className="item_card">
                <h4>Disponível</h4>
                <p>{getCardValues().disponivel} - Unidades</p>
              </div>
              <CheckCircleOutlined />
            </div>
            <div className="cards_item">
              <div className="item_card">
                <h4>Reservado</h4>
                <p>R$ {getCardValues().reservado}</p>
              </div>
              <DollarCircleOutlined />
            </div>
            <div className="cards_item">
              <div className="item_card">
                <h4>Vendido</h4>
                <p>R$ {getCardValues().vendido}</p>
              </div>
              <DollarCircleOutlined />
            </div>
          </div>
        );
    }

    const ButtonRow = () => {
        return (
          <div className="btn_container">
            <button className="btn_voltar" onClick={() => navigate("/")}><LeftOutlined />  Voltar</button>
          </div>
        );
    }

    const Form = (props) => {
      var nome_emp = '';
      var localizacao_emp = '';
      var prev_entrega_emp = '';

      if(!!props.emp){
        const {
          nome, localizacao, prev_entrega
        } = props.emp;

        nome_emp = nome;
        localizacao_emp = localizacao;
        prev_entrega_emp = prev_entrega;
      }

      const [nomeEmp,setNomeEmp] = useState(null);
      const [localEmp,setLocal] = useState(null);
      const [prevEmp,setPrev] = useState(null);

      useEffect(()=>{
        setNomeEmp(nome_emp || '')
        setLocal(localizacao_emp || '')
        setPrev(prev_entrega_emp || '')
      },[])

      function handlerSave(event) {
        event.preventDefault();
        const newData = {
          nome : nomeEmp,
          localizacao : localEmp,
          prev_entrega : prevEmp
        }
          useFetch('PUT',`empreendimentos/${id}`,{},newData).then((res) => {
            const [data, err] = res
      
            const type = !!data ? 'success' : 'error'
            notification[type]({
              message: !!data ? 'Empreendimento salvo com sucesso' : 'error'
            });
          }) 
      };    

        return (
          <div className="form_container">
            <form className="form">
              <div className="item_form">
                <div>
                <label htmlFor="nome">Nome</label>
                </div>
                <div>
                <input type="text" name="nome" id="nome" value={nomeEmp} onChange={(event)=> setNomeEmp(event.target.value)}/>
                </div>
              </div>
              <div className="item_form">
                <div>
                  <label htmlFor="localizacao">Localização</label>
                </div>
                <div>
                  <input type="text" name="localizacao" id="localizacao" value={localEmp} onChange={(event)=> setLocal(event.target.value)}/>
                </div>
              </div>
              <div className="item_form">
                <div>
                 <label htmlFor="prev">Previsão de Entrega</label>
                </div>
                <div>
                  <input type="date" name="prev_entrega" id="prev" value={prevEmp} onChange={(event)=> setPrev(event.target.value)}/>
                </div>
              </div>
              <button className="btn_salvar" id="salvar" onClick={(event) => handlerSave(event)}>Salvar  <SaveOutlined /></button>
            </form>
          </div>
        );
    }

    return (
      <>
        <Layout>
            <Content>             
              <Image width={200} src="../../../public/logo.png" /> 
              <Divider />
              <div className="container">
                {/* EMPREENDIMENTO */}
                <div className="block">
                  <h3>{emp[0]?.empreendimento}</h3>
                  <ButtonRow/>
                  <Divider />
                  <Cards />
                  <Divider />
                  <Form emp={emp[0]}/>
                </div>
                {/* UNIDADES */}
                <div>
                  <ModalCreateUni
                  idEmp={id}
                  />
                  <RenderUnidades unidades={uni} />
                </div>
              </div>
            </Content>
        </Layout>
    
      </>
    );
}

const ModalCreateUni = (props) => {
  const {idEmp} = props
  const [blocos, setBlocos] = useState();
  const [modalCreate, setModalCreate] = useState(false);
  const [value, setValue] = useState();
  const [id_bloco, setIdBloco] = useState();
  const [id_status, setIdStatus] = useState();

  useEffect(() => {
    async function getData(){
        const [dataBloc,errBloc] = await useFetch('GET',`blocos/getblocos/${idEmp}`)
        !!dataBloc && (setBlocos(dataBloc));

        console.log(dataBloc)
        console.log(errBloc)
    } getData()
  }, []);

  const handlerCreate = () => {
    useFetch('POST',`unidade`,{},{
      valor:value, id_bloco, id_status
    }).then((res) => {
      const [data, err] = res
      data && (console.log(data), setModalCreate(false) )
      err && console.log(err)
    })
  };

  const handlerCreateBloc = () => {
    useFetch('POST',`blocos`,{},{
      id_empreendimentos:idEmp
    }).then((res) => {
      const [data, err] = res

      const type = !!data ? 'success' : 'error'
      notification[type]({
        message: !!data ? 'Bloco adicionado com sucesso' : 'error'
      });
    })
  };
  
  return (
    <div className="row_btn_criar">
      <button className="btn_criar" style={{marginRight:'31px'}} onClick={() => handlerCreateBloc()}> Adicionar Bloco</button>
      <button className="btn_criar" onClick={() => setModalCreate(true)}>Adicionar Unidade <PlusSquareOutlined /></button>
      <div>
          <Modal
            title="Adicionar Unidade"
            centered
            visible={modalCreate}
            onOk={() => handlerCreate()}
            onCancel={() => setModalCreate(false)}
            okText= 'Adicionar'
            cancelText= 'Cancelar'
          >
              <Form>
                <Form.Item label="Valor">
                  <Input 
                  type='number'
                  placeholder="000.00"                   
                  onChange={(event) =>{
                    setValue(event.target.value)
                    }
                }
                  />
                </Form.Item>
                <Form.Item label="Situação">
                  <Select         
                  onChange={(value) => 
                    setIdStatus(value)
                }
                  >
                    <Select.Option value="1">DISPONÍVEL</Select.Option>
                    <Select.Option value="2">VENDIDA</Select.Option>
                    <Select.Option value="3">RESERVADA</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Blocos">
                  <Select 
                  onChange={(value) =>     
                    setIdBloco(value)
                }
                  >{
                    blocos?.map(m => <Select.Option value={m.id}>Bloco - {m.id}</Select.Option>)
                  }
                  </Select>
                </Form.Item>
              </Form>
          </Modal>
        </div>   
    </div>
  )
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
    const [fetching,setFetching] = useState(false); 
    const [status,setStatus] = useState([]); 
    const [itemUni,setitemUni] = useState([]);  
    const [statusInput, setStatusInput] = useState([]);
    const [valorInput, setValorInput] = useState(0);


    useEffect(() => {
        setitemUni(item)
        setValorInput(item.valor)
        setStatusInput(item.descrição)
        async function getData(){
            const [data,err] = await useFetch('GET',"status")
            !!data && setStatus(data);         

        } getData()
    }, [])

    const handlerSave = () => {
        const data = {
            valor : valorInput,
            id_status : statusEnum[statusInput]
        }

        setFetching(true);
        useFetch('PUT',`unidade/${item.id}`,{},data)
        .then((res) => setitemUni(res))
        .finally(() => {
            setFetching(false)
        });
    }

    const handlerDelete = (event) => {
      setFetching(true);
      useFetch('DELETE',`unidade/${item.id}`)    
      .finally(() => {
          setFetching(false)
          event.target.parentElement.remove()
      });

    }

    return (
        <div className="unidade_item">
            <p>Unidade:{itemUni.id}</p>
            <select value={statusInput} onChange={(event) => setStatusInput(event.target.value)}>
                {
                    status?.map(m => <option key={m.id} value={m.descrição}>{m.descrição}</option>)
                }
            </select>
            <label htmlFor="Valor">R$</label>
            <input  type="text" id="Valor" value={valorInput} onChange={(event) => setValorInput(event.target.value)}/>
            <p>Bloco {itemUni.id_bloco}</p>
            {
                !fetching 
                ? <button className="btn_salvar" onClick={() => handlerSave()}>Salvar</button> 
                : <button className="btn_salvar" disabled >Salvando</button> 
            }

            <button className="btn_voltar" onClick={(event) => handlerDelete(event)}>Excluir</button>
        </div>
    )
}
export default Edit;

