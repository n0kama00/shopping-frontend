import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoppinglist/';

function App() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amounts, setAmounts] = useState([]);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get(URL)
    .then((response) => {
      setItems(response.data);
      setAmounts(response.data);
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }, []);

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: item, amount: amount })
    axios.post(URL + 'save.php', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      console.log(response);
      setItems(items => [...items, response.data]);
      setItem('');
      setAmounts(amounts => [...amounts, response.data]);
      setAmount('');
    }).catch (error => {
      alert(error.response.data.error)
    });
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + 'remove.php', json, {
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((response) => {
        console.log(response);
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        const newAmountListWithoutRemoved = amounts.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
        setAmounts(newAmountListWithoutRemoved);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className="container">
    <h3> Shopping list </h3>
    <form onSubmit={save}>
      <label> New item </label>
      <input value={item} onChange={e => setItem(e.target.value)} placeholder="Item"/>
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount"/>
      <button> Add </button>
    </form>
    <ul>
      {items?.map(item => (
        <li key={item.id}>{item.description}</li>
      ))}
    </ul>
    <ul>
      {amounts?.map(amount => (
        <li key={amount.id}>{amount.amount}
          <a href="#" className="delete" onClick={() => remove(amount.id)}>Delete</a>
        </li>
      ))}
    </ul>   
  </div>
  );
}

export default App;
