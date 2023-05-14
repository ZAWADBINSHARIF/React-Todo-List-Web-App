import { useState, useEffect } from 'react'
import Header from './Header'
import AddItem from './AddItem'
import SearchItem from './SearchItem'
import Content from './Content'
import Footer from './Footer'
import apiRequest from './api/apiRequest'

function App() {

  const API_URL = "http://localhost:9999/items";

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [isFetchError, setIsFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('Did not recevie expected data!');
        const listItems = await response.json();
        setItems(listItems);
      } catch (error) {
        setIsFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    setTimeout(() => {
      fetchItems();
    }, 2000)

  }, [])

  const addItem = async item => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = {
      id,
      checked: false,
      item
    }
    const listItems = [...items, myNewItem];
      setItems(listItems);

      const postOption = {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(myNewItem)
      }

      const result = await apiRequest(API_URL, postOption);
      if (result) setIsFetchError(result);

  };

    const handleCheck = async id => {
    const listItems = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
      setItems(listItems);

      const myItem = listItems.filter(item => item.id === id);
      const updateOptions = {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ checked: myItem[0].checked })
      };

      const reqUrl = `${API_URL}/${id}`;
      const result = await apiRequest(reqUrl, updateOptions);
      if (result) setIsFetchError(result);
  }

  const handleDelete = async id => {
    const listItems = items.filter(item => item.id !== id);
      setItems(listItems);

      const deleteOptions = {
          method: "DELETE"
      };

      const reqUrl = `${API_URL}/${id}`;
      const result = await apiRequest(reqUrl, deleteOptions);
      if (result) setIsFetchError(result);
      console.log(result)
  }

  const handleSubmite = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem)
    setNewItem('');
  }

  return (
    <div className="App">
      <Header title='Groceries List' />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmite={handleSubmite}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading item...</p>}
        {isFetchError && <p style={{ color: "red" }}>{`Error: ${isFetchError}`}</p>}
        {!isFetchError && !isLoading &&
          <Content
            items={items.filter(item => (item.item).toUpperCase().includes(search.toUpperCase()))}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        }
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;