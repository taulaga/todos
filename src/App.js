import React from 'react';
import { FormControlLabel, Checkbox, TextField, Button, Container } from '@material-ui/core';

const config = 'http://localhost:3000/todos';

function App() {
  const [textWork, setTextWork] = React.useState('');
  const [listTodos, setListTodos] = React.useState([]);

  const makeID = () => {
    if (!listTodos.length) return 0;
    else return listTodos[listTodos.length - 1].id + 1;
  };

  // Load
  React.useEffect(() => {
    (async () => {
      // Component did mount
      try {
        const res = await fetch(config).then((res) => res.json());
        setListTodos(res);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Set todo
  const addTodo = async () => {
    const newTodo = {
      id: makeID(),
      name: textWork,
      status: false,
    };
    
    // Luu lai cong viec tren server
    try {
      const res = await fetch(config, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.status === 201) {
        setListTodos(listTodos.concat(newTodo));
        setTextWork('');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Change status
  const changeStatus = async (newStatus, id) => {
    const indexID = listTodos.findIndex((item) => item.id === id);
    if (indexID > -1) {
      const newTodoList = JSON.parse(JSON.stringify(listTodos));
      newTodoList[indexID].status = newStatus;
      // update status
      try {
        const res = await fetch(`${config}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(newTodoList[indexID]),
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (res.status === 200) {
          setListTodos(newTodoList);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Delete item
  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${config}/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.status === 200) {
        const newList = [];
        listTodos.forEach((todo) => {
          if (todo.id !== id) newList.push(todo);
        });
        setListTodos(newList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container maxWidth="sm">
      <TextField
        value={textWork}
        id="work"
        label="Content"
        onChange={(value) => setTextWork(value.target.value)}
      />
      <Button variant="contained" color="primary" onClick={addTodo} >
        Submit
      </Button>
      <br />
      {listTodos.map(({ name, status, id }) => (
        <div key={id + name}>
          <FormControlLabel
            control={
              <Checkbox
                checked={status}
                onChange={(value) => changeStatus(value.currentTarget.checked, id)}
                color="primary"
              />
            }
            label={`${name} `}
          />

          <Button variant="contained" color="secondary" onClick={() => deleteItem(id)} >
            Delete
          </Button>
          <br />
        </div>
      ))}
    </Container>
  );
}

export default App;
