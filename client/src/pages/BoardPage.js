import React, { Component } from 'react'
import { CreateBoardComponent } from '../components/board/CreateBoardComponent'
import { BoardListComponent } from '../components/board/BoardListComponent'
import { connect } from 'react-redux'
import {getBoard, deleteAllBoards} from '../utils/api'
import models from '../utils/models'

const {
 BoardModel
} = models;

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
        isCreateBoardBoxOpened: true,
        errorMessage: null
    };
    this.switchCreateContainerBox = () => {
        this.setState({isCreateBoardBoxOpened: !this.state.isCreateBoardBoxOpened})
    };
    this.setErrorMessage = (payload) => {
        this.setState({errorMessage:payload})
    };
    this.createNewBoard = (val) => {
        const namesOfExistingBoards = this.props.state.boardList.map((i) => {return i.name})
        const isNameUnique = namesOfExistingBoards.indexOf(val) === -1

        if (isNameUnique) {
            let newBoard = new BoardModel(val)
            newBoard.id = this.props.state.boardList.length * Math.random(1, 99);
            this.props.actions({type: 'ADD_BOARD_IN_THE_LIST', payload: newBoard});
            this.switchCreateContainerBox()
        }
    };
    this.deleteBoard = (ev, id) => {
        ev.preventDefault();
        ev.stopPropagation();

        let boards = this.props.state.boardList;
        let filtratedBoards = boards.filter((el) => {
            return el.id !== id
        });
        if (filtratedBoards.length !== boards.length) {
            this.props.actions({type: 'REMOVE_BOARD', payload: {id}})
        }
    };

    this.toBoard = (id) => {
        this.props.history.push('/' + id)
    };
  }

    componentDidMount () {
        getBoard().then(res => {
            this.props.actions({type: 'SET_STATE', payload: res})
        })
    }
  render () {
    const createBoardComponentProps = {
      errorMessage: this.state.errorMessage,
      switchBoxState: this.switchCreateContainerBox.bind(this),
      setErrorMessage: this.setErrorMessage.bind(this),
      returnFormValue: this.createNewBoard.bind(this),
      isOpen: this.state.isCreateBoardBoxOpened
    };

    return (
        <div>
              <div className="main">
                <CreateBoardComponent
                    props={createBoardComponentProps}/>
                <BoardListComponent
                    toBoard={this.toBoard}
                    deleteBoard={this.deleteBoard}
                    list={this.props.state.boardList}/>
              </div>
        </div>
    )
  }
}

export default connect (
    state => ({state}),
    actions => ({actions})
)(Main)