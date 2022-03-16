import React from 'react'
import './App.css';
import { nanoid } from 'nanoid'
import ListItem from './components/ListItem';
import NewItemOverlay from './components/NewItemOverlay'
import PriceUpdater from './components/PriceUpdater'


import Header from './components/Header'
import ActionBar from './components/ActionBar';

function App() {
  const [listData, setListData] = React.useState([
    // {
    //   key: "QHG0_lWJJNSJ_ZGaqM2GH",
    //   itemTitle: "milk",
    //   completed: false,
    //   itemPrice: null,
    //   itemQuantity: 1,
    //   category: "Dairy"
    // },
    // {
    //   key: "fYoq6EpxlXyZzh-Uy-Q0X",
    //   itemTitle: "cheese",
    //   completed: false,
    //   itemPrice: 2,
    //   itemQuantity: 2,
    //   category: "Dairy"
    // },
    // {
    //   key: "edE-pRTkStlE1tYlo-yEQ",
    //   itemTitle: "yogurt",
    //   completed: false,
    //   itemPrice: null,
    //   itemQuantity: 1,
    //   category: "Dairy"
    // },
    // {
    //   key: "PauwA2Tny5jVWcYOnGREp",
    //   itemTitle: "ground beef",
    //   completed: true,
    //   itemPrice: 3.47,
    //   itemQuantity: 1,
    //   category: "Meat"
    // }
  ]
  )
  const [overlay, setOverlay] = React.useState(false)
  const [priceOverlay, setPriceOverlay] = React.useState(false)
  const initialTempItem = [{
    itemTitle: "",
    itemQuantity: "",
    itemPrice: null,
    category: ""
  }]
  const [tempItem, setTempItem] = React.useState(initialTempItem)
  let totalCost = 0


  const [currentItemId, setCurrentItemId] = React.useState("")
  updateTotal()

  const allListItems = listData.map(item => {
    return (
      <ListItem
        key={item.key}
        id={item.key}
        title={item.itemTitle}
        completed={item.completed}
        price={item.itemPrice}
        quantity={item.itemQuantity}
        listData={listData}
        toggleComplete={toggleComplete}
        setCurrentItemId={setCurrentItemId}
        openEditPane={toggleNewItemOverlay}
        setTempItem={setTempItem}
        togglePriceOverlay={togglePriceOverlay}

      />
    )
  })

  function toggleNewItemOverlay(event) {
    setOverlay(prevState => !prevState)
  }
  function closeEditOverlay() {
    setOverlay(false)
    setCurrentItemId("")
  }
  function togglePriceOverlay(event) {
    setPriceOverlay(!priceOverlay)
  }
  function openNewItem() {
    setTempItem(initialTempItem)
    setOverlay(true)
  }

  function storeTextInput(event) {
    const { name, value } = event.target
    setTempItem(prevState => ({ ...prevState, [name]: value }))
  }

  function createItem() {
    const newID = nanoid()
    const newDetails = {
      key: newID,
      itemTitle: tempItem.itemTitle,
      itemQuantity: tempItem.itemQuantity,
      completed: false,
      itemPrice: null,
      category: tempItem.category
    }
    setListData(prevState => [...prevState, newDetails])
    setTempItem(initialTempItem)
    setOverlay(false)
  }
  function savePrice() {
    setListData(prevState => prevState.map(item => item.key === currentItemId ? { ...item, itemPrice: tempItem.itemPrice } : item))
    setPriceOverlay(false)
  }
  function saveItemUpdate(event) {
    setListData(prevState => prevState.map(item => item.key === currentItemId ? { ...tempItem } : item))
    setOverlay(false)
  }

  function toggleComplete(event) {
    const { name, value, type, checked } = event.target
    setListData(prevState => prevState.map(item => item.key == event.target.parentNode.id ? { ...item, [name]: checked } : item))
  }

  function deleteItem(event) {
    const { name, value, type, checked, parentNode } = event.target
    setListData(prevState => prevState.filter(item => item.key != currentItemId))
    setOverlay(false)
  }

  function updateTotal() {
    listData.map(
      item => {
        let price
        let quantity
        if (item.itemPrice === null) {
          price = 0
        } else {
          price = parseFloat(item.itemPrice)
        }
        if (!item.itemQuantity) {
          quantity = 1
        } else {
          quantity = parseInt(item.itemQuantity)
        }
        return totalCost += (price * quantity)
      })
    totalCost = totalCost.toFixed(2)
  }

  return (
    <div className="App">
      <Header />

      <h2 className="list-header"></h2>
      <div className="item-container">
        {allListItems.length > 0 ? allListItems : <button className="btn btn--empty-list" onClick={openNewItem}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="#e5694f" viewBox="0 0 24 24" stroke="#ffffff" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />

          </svg>Add your first item
        </button>}
      </div>
      <ActionBar currentTotal={totalCost} handleClick={openNewItem} />

      {overlay &&
        <NewItemOverlay
          closeOverlay={toggleNewItemOverlay}
          closeEditOverlay={closeEditOverlay}
          saveItem={createItem}
          storeText={storeTextInput}
          storedTitle={tempItem.itemTitle}
          storedCategory={tempItem.category}
          storedQuantity={tempItem.itemQuantity}
          saveItemUpdate={saveItemUpdate}
          deleteItem={deleteItem}
          currentItemId={currentItemId}
        />}
      {priceOverlay &&
        <PriceUpdater
          togglePriceOverlay={togglePriceOverlay}
          storedPrice={tempItem.itemPrice}
          storeText={storeTextInput}
          savePrice={savePrice}
          setCurrentItemId={setCurrentItemId}
        />
      }

    </div>
  );
}

export default App;
