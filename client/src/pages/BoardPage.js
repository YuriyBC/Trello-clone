import React, {Component} from 'react'
import {CreateBoardComponent} from '../components/board/CreateBoardComponent'
import {BoardListComponent} from '../components/board/BoardListComponent'
import {connect} from 'react-redux'
import {getBoard, deleteAllBoards} from '../utils/api'
import models from '../utils/models'
import methods from '../utils/_methods'
import Sortable from 'sortablejs'

const {
    BoardModel
} = models;

const {
    calculateNextId
} = methods;

class Main extends Component {
    constructor(props) {
        super(props);
        this.boardTableRef = React.createRef();
        this.state = {
            isCreateBoardBoxOpened: true,
            errorMessage: null
        };

        this.switchCreateContainerBox = () => {
            this.setState({isCreateBoardBoxOpened: !this.state.isCreateBoardBoxOpened})
        };
        this.setErrorMessage = (payload) => {
            this.setState({errorMessage: payload})
        };
        this.createNewBoard = (val) => {
            const namesOfExistingBoards = this.props.state.boardList.map((i) => {
                return i.name
            });
            const isNameUnique = namesOfExistingBoards.indexOf(val) === -1;

            if (isNameUnique) {
                let newBoard = new BoardModel(val);

                newBoard.id = calculateNextId(this.props.state.boardList);
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

        this.setTableSortable = () => {
            const table = this.boardTableRef.current;
            this.sortable = Sortable.create(table, {
                group: {
                    name: '.board__container',
                    put: ['.board__block']
                },
                onEnd: (ev) => {
                    // if (ev.item.id) {
                    //     let draggedBoard = this.props.state.boardList.find((el) => {
                    //         return el.id === +ev.item.id
                    //     });
                    //
                    //     let newIndex =  ev.newIndex -1;
                    //     let oldIndex =  ev.oldIndex -1;
                    //     let draggedPositionBoard = this.props.state.boardList[newIndex];
                    //     this.props.state.boardList[newIndex] = draggedBoard;
                    //     this.props.state.boardList[oldIndex] = draggedPositionBoard;
                    //
                    //     this.props.state.boardList.forEach((el, index) => {
                    //         el.order = index
                    //     });
                    //
                    //     this.props.actions({
                    //         type: 'SET_STATE',
                    //         payload: this.props.state.boardList
                    //     })
                    // }
                    // console.log(this.props.state.boardList)
                }
            });
        };

        this.setBackground = () => {
            window.particlesJS.load('particles-js', '/particlesjs-config.json', () => {
                console.log('sdcdc')
            });
        }
    }

    componentDidMount() {
        getBoard().then(res => {
            this.setBackground();
            this.props.actions({type: 'SET_STATE', payload: res});
            this.setTableSortable();
        })
    }

    render() {
        const createBoardComponentProps = {
            errorMessage: this.state.errorMessage,
            switchBoxState: this.switchCreateContainerBox.bind(this),
            setErrorMessage: this.setErrorMessage.bind(this),
            returnFormValue: this.createNewBoard.bind(this),
            isOpen: this.state.isCreateBoardBoxOpened
        };

        return (
            <div>
                <div ref={this.boardTableRef} className="main">
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

export default connect(
    state => ({state}),
    actions => ({actions})
)(Main)