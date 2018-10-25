import React from 'react'
import './CreateBoardComponent.css'
import iconCancel from '../../assets/svg/ic-cancel.svg'

export const CreateBoardComponent = (props) => {
    const {
        isOpen,
        switchBoxState,
        errorMessage,
        setErrorMessage,
        returnFormValue
    } = props.props

    const returnFormData = () => {
        if (validateForm()) {
            returnFormValue(this.nameForm.value)
            this.nameForm.value = ''
        } else {
            setErrorMessage('Oops! Looks like you forgot the name!')
        }
    }

    const validateForm = () => {
        if (!this.nameForm.value) return false
        return true
    }

    const keyPressHandler = (ev) => {
        if (ev.keyCode === 13) {
            returnFormData()
        }
    }

    return (
        isOpen ?
        <div className="board__container board__block" onClick={switchBoxState}>
            <div className="board__container title">
                <p onClick={switchBoxState}>Create a new board...</p>
            </div>
        </div> :
        <div className="board__container board__block opened">
            <div className="board__container title">
                <p onClick={switchBoxState}>Creating a board</p>
                <i onClick={switchBoxState} className="far fa-times-circle"/>
            </div>
            <div className="board__container text">What shall we call the board?</div>
            <div>
                <input
                    onKeyDown={keyPressHandler}
                    ref={(nameForm) => {this.nameForm = nameForm; }} type="text"/>
                {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            </div>
            <div>
                <button onClick={switchBoxState}>Cancel</button>
                <button onClick={returnFormData.bind(this)}>Create</button>
            </div>
        </div>

    )
}