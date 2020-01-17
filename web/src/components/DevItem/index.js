import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faLink, faUserMinus, faUserCheck, faUserTimes } from '@fortawesome/free-solid-svg-icons'
import './styles.css';
import api from '../../services/api';

function DevItem({ dev, onRemove }){

    const [editorMode, setEditorMode] = useState(false);
    
    const [editorName, setEditorName] = useState(dev.name || dev.github_username);
    const [editorTechs, setEditorTechs] = useState(dev.techs.join(', '));
    const [editorBio, setEditorBio] = useState(dev.bio || '');

    function changeEditorMode(newValue){
      setEditorMode(newValue);
    }

    function renderBio(editMode){
      if(editMode) return <input value={editorBio} onChange={e => setEditorBio(e.target.value)} placeholder="Digite a bio..."></input>;
      else if(editorBio) return <p>{editorBio}</p>;
      else return <p className='empty'>Não há informação...</p>;
    }

    function renderUserInfo(editMode){
      if(editMode){
        return (
          <div className="user-info user-info-edit">
            <input id="name" placeholder="Digite o nome..." onChange={e => setEditorName(e.target.value)} value={editorName}></input>
            <input placeholder="Digite as tecnologias..." onChange={e => setEditorTechs(e.target.value)} value={editorTechs}></input>
          </div>
          );
        }
        else{
          return (
            <div className="user-info">
              <strong>{editorName}</strong>
              <span>{editorTechs}</span>
            </div>
          )  
        }
    }

    function renderActions(editMode){
      if(editMode){
        return (
          <div className="actions">
            <span title="Salvar" onClick={handleChangeDev} className="edit"><FontAwesomeIcon icon={faUserCheck} /></span>
            <span onClick={() => changeEditorMode(false)} title="Cancelar" className="remove"><FontAwesomeIcon icon={faUserTimes} /></span>
          </div>
        )
      }
      else{
        return (
          <div className="actions">
            <span onClick={() => changeEditorMode(true)} className="edit"><FontAwesomeIcon icon={faUserEdit} /></span>
            <span onClick={handleRemoveDev} className="remove"><FontAwesomeIcon icon={faUserMinus} /></span>
          </div>
        )
      }
    }

    function handleChangeDev(){
      let { github_username, name, bio } = dev;
      let techs = dev.techs.join(', ');
      
      let changed = false;
      
      if(editorName && editorName !== name){
        name = editorName;
        changed = true;
      }

      if(editorBio !== bio){
         bio = editorBio;
         changed = true;
      }

      if(editorTechs && editorTechs !== techs){
        techs = editorTechs;
        changed = true;
      }

      if(changed){
        (async () => {
          const response = await api.put(`/devs/${github_username}`, {name, bio, github_username, techs});
          const newValues = response.data.new;
          setEditorName(newValues.name);
          setEditorBio(newValues.bio);
          setEditorName(newValues.name);
        })();
      } 
      
      changeEditorMode(false);

    }

    async function handleRemoveDev(e) {
      e.preventDefault();
      await onRemove(dev.github_username)
    }

    return(
      <li className="dev-item">
        {renderActions(editorMode)}
        <header>
          <img src={dev.avatar_url} alt={dev.name}></img>
          {renderUserInfo(editorMode)}
        </header>
        {renderBio(editorMode)}
        <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${dev.github_username}`}>
          <FontAwesomeIcon icon={faLink} />Acessar perfil no Github
        </a>
      </li>
    );
}

export default DevItem;