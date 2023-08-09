import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Button } from "@chakra-ui/react";
import Query from "./Query"
import {accessTokenSelector} from "../state/userSlice";
import {useSelector, useDispatch} from "react-redux";
import { useNavigate } from 'react-router-dom';
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { currentProjectSelector } from "../state/currentProjectSlice";
import { resetProject } from "../state/currentProjectSlice";

const query = new Query();

const style1 = {
  height: '5rem',
  width: '12rem',
  margin: '1rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const style2 = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  margin: '1rem',
  cursor: 'move',
  float: 'left',
}

const style3 = {
  width: '12rem',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',  
}

const containerStyle = {
  overflow: 'hidden',
  margin: '1rem',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const DndComponent =  () => {
  const dispatch = useDispatch();
  const project = useSelector(currentProjectSelector);
  const navigate = useNavigate();
  const accessToken = useSelector(accessTokenSelector);
  const [services, setServices] = useState({ client: '', server: '' })
  const [connectionUrl, setConnectionUrl] = useState("")
  
  const handleDeploy = async (connectionUrl, client, server) => {
    const result = await query.updateProject(project._id, {
      ...project,
      "connection_url": connectionUrl,
      "client": client,
      "server": server
      },
      accessToken
    )
    dispatch(resetProject());
    navigate("/project/dashboard")
  }

  const Client = () => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: 'BOX',
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return
        }
        setServices((prevState) => ({ ...prevState, client: item.name }))
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }))
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
      backgroundColor = 'darkgreen'
    } else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }
    return (
      <div ref={drop} style={{ ...style1, backgroundColor }}>
        {services.client || "Client"}
        
        {services.client && (
          <button onClick={() => setServices((prevState) => ({ ...prevState, client: '' }))}>
          <FontAwesomeIcon icon={faTrashCan} style={{marginLeft:"10px"}}/>
        </button>
        )}
      </div>
    )
  }

  const Server = () => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: 'BOX',
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return
        }
        setServices((prevState) => ({ ...prevState, server: item.name }))
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }))
    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    if (isActive) {
      backgroundColor = 'darkgreen'
    } else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }
    return (
      <div ref={drop} style={{ ...style1, backgroundColor }}>
        {services.server || "Server"}
        {services.server && (
          <button onClick={() => setServices((prevState) => ({ ...prevState, server: '' }))}>
          <FontAwesomeIcon icon={faTrashCan} style={{marginLeft:"10px"}}/>
        </button>
        )}
      </div>
    )
  }

  const Box = ({ name }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'BOX',
      item() {
        if (services.client === name || services.server === name) return null
        return { name }
      },
      collect(monitor) {
        return {
          isDragging:
            monitor.isDragging() &&
            services.client !== name &&
            services.server !== name,
        }
      },
    }))
    const opacity =
      isDragging || services.client === name || services.server === name ? 0.4 : 1
    return (
      <div ref={drag} style={{ ...style2, opacity }}>
        {name}
      </div>
    )
  }


  return (
    <div style={containerStyle}>
      <div style={{ overflow: 'hidden', clear: 'both', minHeight:"5rem"}}>
        {project.services?.map((item) => (
          <Box name={item} key={item} />
        ))}
      </div>
      <div style={containerStyle}>
        <Client />
        <input type="text" placeholder="connection url" style={{ ...style3 }} onChange={(e) => setConnectionUrl(e.target.value)} />
        <Server />
      </div>
      <Button variant="customDefault" isDisabled={project.services.length == 0 || project.services.length == undefined || project.services.length == null 
                            } onClick={() => {handleDeploy(connectionUrl, services.client, services.server)}}>
                                Save
                            </Button>
    </div>
  )
}

export default DndComponent
