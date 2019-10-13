const React = require("react");
const fs = require('fs');
const styled = require("styled-components").default
const { Modal, Button, InputGroup, FormControl, Table } = require("react-bootstrap")
const { ipcRenderer } = require("electron")
const { FaPlus, FaEdit, FaTrash} = require("react-icons/fa")
const Container = styled.div`
  display: flex;
  height: 100vh;
`

const Collections = styled.div`
  width: 30%;
`

const Content = styled.div`
  border-left: 1px solid #ccc;
  width: 100%;
`

class Manager extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      collections: [],
      openModal: false,
      selected: {},
      txtColec: ""
    }
  }

  handleModal = () => {
    this.setState({...this.state, openModal: !this.state.openModal})
  }

  addCollection = () => {
    const res = ipcRenderer.sendSync('add-collection', {title: this.state.txtColec})
    this.setState({...this.state, collections: ipcRenderer.sendSync('get-collections'), txtColec: ""}, () => {
      this.handleModal()
    })
    // ipcRenderer.sendSync('get-collections')}
  }

  inputCollection = (e) => {
    this.setState({...this.state, txtColec: e.target.value})
  }

  componentDidMount() {
    // const cols = ipcRenderer.sendSync('get-collections')
    const raw = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
      <style>
        .do {
          background: red;
        }
      </style>
    </head>
    <body class="do">
      Nhap nha
    </body>
    </html>
    `
    const abc =  ipcRenderer.sendSync('load-file', raw)
    console.log(abc)
    if(abc) {
      const wb = document.getElementById('foo')
      fs.readFile(abc, 'utf8',(err, data) => {
        console.log(data)
      })
      // debugger
      wb.src = 'file://' + abc
      console.log(wb)
    }
    // console.log(ipcRenderer.sendSync('add-collection', {title: 'deepread'}))
    // if(cols) {
    //   this.setState({...this.state, collections: cols, selected: cols[0]}, () => {
    //     console.log(this.state)
    //   })
    // }
  }



  render() {
    return (
      <div className="do">
        <Container>
          <Collections>
            <ul>
              {this.state.collections.map( i => <li key={i.id}>{i.title}</li>)}
            </ul>
            <Button onClick={this.handleModal}>THem</Button>
          </Collections>
          <Content>
          <Button><FaPlus /></Button>
          {this.state.selected && this.state.selected.title}
          {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Key</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.selected && this.state.selected.items.map((item, ix) => (
                <tr>
                  <td>{ix}</td>
                  <td>{item.key}</td>
                  <td>{item.value}</td>
                  <td>
                    <FaEdit /> <FaTrash />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> */}
          </Content>
        </Container>
        <Modal show={this.state.openModal} onHide={this.handleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add collection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup>
              <FormControl placeholder="collections name" onChange={this.inputCollection}/>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleModal} variant="secondary">Close</Button>
            <Button onClick={this.addCollection} variant="primary">Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

module.exports =  Manager;
