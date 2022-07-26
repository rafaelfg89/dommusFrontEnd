import { Space, Table, Image, Layout, Divider, Input, Modal, Form, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/usefetch';
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined 
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

const Home = () => {
    const [emp,setEmp] = useState([]);
    const [fetching,setFetching] = useState(false);
    const [error,setError] = useState(false);
    
    useEffect(() => {
        setFetching(true);
        async function getData(){
            const [data,err] = await useFetch('GET',"empreendimentos")
            const dataReturn = data.map(m => {return{...m , key : m.id}})
            !!data && (setEmp(dataReturn), setFetching(false));
            !!err && setError(err)
        } getData()

    }, []);

    async function handlerDelete (url, event){
      const [data,err] = await useFetch('DELETE',url)

      const type = 'success' 
      notification[type]({
        message: 'Empreendimento salvo com sucesso' 
      });
    }

    const columns = [
        {
          title: 'Empreendimento',
          dataIndex: 'nome',
          key: 'nome',
        },
        {
          title: 'Localização',
          dataIndex: 'localizacao',
          key: 'localizacao',
        },
        {
          title: 'Ação',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Link to={`/edit/${record.id}`}><EditOutlined /></Link>
              <a onClick={(event) => handlerDelete(`/empreendimentos/${record.id}`,event)}><DeleteOutlined /></a>
            </Space>
          ),
        },
      ];

return (
    <Layout>
      <Content>
        <Image width={200} src="../../../public/logo.png" />
        <Divider />
        <ModalCreateEmp emp={emp} setEmp={setEmp}/>
        <Table columns={columns} dataSource={emp} />
      </Content>
    </Layout>
)
}

const ModalCreateEmp = (props) => {
  const {emp, setEmp} = props;

  const [modalCreate, setModalCreate] = useState(false);
  const [nomeEmp,setNomeEmp] = useState('');
  const [localEmp,setLocal] = useState('');
  const [prevEmp,setPrev] = useState('');

  function handlerCreate(event) {
    event.preventDefault();
    const newData = {
      nome : nomeEmp,
      localizacao : localEmp,
      prev_entrega : prevEmp
    }
      useFetch('POST',`empreendimentos`,{},newData).then((res) => {
        const [data, err] = res
  
        const type = !!data ? 'success' : 'error'
        notification[type]({
          message: !!data ? 'Empreendimento salvo com sucesso' : 'error'
        });
        !!data && setEmp({
          ...emp,
          data
        })
      }) 
  };   
  
  return (
    <div className="row_btn_criar">
      <button className="btn_criar" onClick={() => setModalCreate(true)}>Adicionar Unidade <PlusSquareOutlined /></button>
      <div>
          <Modal
            title="Adicionar Empreendimento"
            centered
            visible={modalCreate}
            onOk={(event) => handlerCreate(event)}
            onCancel={() => setModalCreate(false)}
            okText= 'Adicionar'
            cancelText= 'Cancelar'
          >
              <Form>
                <Form.Item label="nome">
                  <Form.Item
                    name="nome"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Nome obrigatório',
                      },
                    ]}
                  >
                    <Input
                      value={nomeEmp} 
                      onChange={(event)=> setNomeEmp(event.target.value)}
                      style={{
                        width: 160,
                      }}
                      placeholder="Nome Empreendimento"
                    />
                  </Form.Item>
                </Form.Item>
                <Form.Item label="Localização">
                  <Form.Item
                    name="Localização"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Localização é obrigatório',
                      },
                    ]}
                  >
                    <Input
                    value={localEmp} 
                    onChange={(event)=> setLocal(event.target.value)}
                      style={{
                        width: 160,
                      }}
                      placeholder="Cidade"
                    />
                  </Form.Item>
                </Form.Item>
                <Form.Item label="Previsão de entraga">
                  <Form.Item
                    name="prev_entrega"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Previsão de entraga é obrigatório',
                      },
                    ]}
                  >
                    <Input
                    value={prevEmp} 
                    onChange={(event)=> setPrev(event.target.value)}
                    type={'date'}
                      style={{
                        width: 160,
                      }}
                      placeholder="Please input"
                    />
                  </Form.Item>
                </Form.Item>
              </Form>
          </Modal>
        </div>   
    </div>
  )
}
export default Home;