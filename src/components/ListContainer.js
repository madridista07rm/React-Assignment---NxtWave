import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const ListContainer = () => {
  const [listData, setListData] = useState({ lists: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListItems, setNewListItems] = useState([]);
  const [list3Items, setList3Items] = useState([]);
  
// fetch data using axios
  const fetchData = async () => {
    try {
      setTimeout(async () => {
        const response = await axios.get(
          "https://apis.ccbp.in/list-creation/lists"
        );
        const data = response.data;
        console.log("Fetched data:", data);
        setListData(data || { lists: [] });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTryAgain = () => {
    setIsLoading(true);
    setError(null);
    fetchData(); // Retry the HTTP GET request
  };

  const handleListCheckboxChange = (listNumber) => {
    setSelectedLists((prevSelectedLists) => {
      if (prevSelectedLists.includes(listNumber)) {
        return prevSelectedLists.filter((num) => num !== listNumber);
      } else {
        return [...prevSelectedLists, listNumber];
      }
    });
  };

  const handleCreateNewList = () => {
    if (selectedLists.length === 2) {
      setIsCreatingList(true);

      const filteredList1Items = listData.lists.filter((item) => item.list_number === selectedLists[0]);
      const filteredList2Items = listData.lists.filter((item) => item.list_number === selectedLists[1]);

      setNewListItems([...filteredList1Items, ...filteredList2Items]);
    } else {
      setErrorMessage("You should select exactly 2 lists to create a new list");
    }
  };

  const handleMoveListItemToList3 = (item) => {
    // Remove the item from its original list
    const updatedListData = { ...listData };
    updatedListData.lists = updatedListData.lists.filter((listItem) => listItem.id !== item.id);
  
    // Add the item to List 3
    const updatedList3Items = [...list3Items, item];
    setListData(updatedListData);
    setList3Items(updatedList3Items);
    setNewListItems([]); // Clear the items in the new list
    setSelectedLists([]);
  };
  
  const handleMoveListItem = (item, sourceListNumber, destinationListNumber) => {
    // Remove the item from the source list
    const updatedListData = { ...listData };
    updatedListData.lists = updatedListData.lists.filter((listItem) => listItem.id !== item.id);
  
    // Add the item to the destination list
    const movedItem = { ...item, list_number: destinationListNumber };
    updatedListData.lists.push(movedItem);
  
    // Remove the item from List 3 if it exists
    const updatedList3Items = list3Items.filter((listItem) => listItem.id !== item.id);
  
    setListData(updatedListData);
    setList3Items(updatedList3Items);
    setNewListItems([]);
  };

  // cancel button functionality
  const handleCancelListCreation = () => {
    setIsCreatingList(false);
    setNewListItems([]);
    setSelectedLists([]);
    setErrorMessage("");
    setList3Items([]); // Reset list3Items to an empty array
    // Reset the state to the initial state by fetching the data again
    setIsLoading(true);
    fetchData();
  };
  
  

  // update button functionality
  const handleUpdateList = () => {
    const updatedList = { ...listData, lists: [...listData.lists, ...newListItems] };
    setListData(updatedList);

    setIsCreatingList(false);
    setNewListItems([]);
    setSelectedLists([]);
    setError(null);
  };

  // if loading show the loading spinner using cliploader 
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <ClipLoader size={30} color={"#123abc"} loading={isLoading} />
      </div>
    );
  }

  // if error occured while fetching data then show an error with a try again button
  if (error) {
    return (
      <div>
        <img
          src={require('../images/error-image.jpg')}
          alt="Failure View"
        />
        <p>Something went wrong. Please try again</p>
        <button onClick={handleTryAgain}>Try Again</button>
      </div>
    );
  }

  const listNumber1Items = listData.lists.filter((item) => item.list_number === 1);
  const listNumber2Items = listData.lists.filter((item) => item.list_number === 2);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow:"hidden" , height: "100%"}}>
      <h2 >List Creation</h2>
      <button className="btn btn-primary mb-3" onClick={handleCreateNewList}>Create a new list</button>
      {/* Display the error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
      
      {/* List Number 1 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', overflowY: 'auto', maxHeight: '500px' }}>
      <div style={{ flexBasis: '300px', minWidth: '300px', border: '1px solid #ccc', padding: '10px', background: '#B4D4FF', borderRadius: '10px' }}>
        <h3>List Number 1 ({listNumber1Items.length})</h3>
        <input
          type="checkbox"
          checked={selectedLists.includes(1)}
          onChange={() => handleListCheckboxChange(1)}
        />
        <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
          {listNumber1Items.map((item, index) => (
            <div style={{ border: '1px solid', padding: '10px', background: '#EEF5FF' , position: 'relative', borderRadius: '10px'}} key={index}>
              <p>Name: {item.name}</p>
              <p>Description: {item.description}</p>
              {isCreatingList && (
                <img onClick={() => handleMoveListItemToList3(item)} src={require('../images/arrow-right.png')} alt="arrow" height={20} style={{position: 'absolute', cursor: 'pointer', top:'75%', right:'10px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

        {/* List Creation */}
        {isCreatingList && (
          <div style={{ flexBasis: '300px', minWidth: '300px', border: '1px solid #ccc', padding: '10px', background: '#B4D4FF', borderRadius: '10px' }}>
            <h2>List Creation ({list3Items.length}) </h2>
            <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
            {list3Items.map((item, index) => (
              <div key={index} style={{ border: '1px solid', padding: '10px', background: '#EEF5FF', position:'relative', borderRadius: '10px' }}>
                <p>Name: {item.name}</p>
                <p>Description: {item.description}</p>
                
                  <img onClick={() => handleMoveListItem(item, item.list_number, 1)} src={require('../images/arrow.png')} alt="arrow" height={20} />
                
                  <img onClick={() => handleMoveListItem(item, item.list_number, 2)} src={require('../images/arrow-right.png')} alt="arrow" height={20} style={{position: 'absolute', cursor: 'pointer', top:'75%', right:'10px' }} />
    
              </div>
            ))}
            </div></div>
        )}

        {/* List Number 2 */}
        <div style={{ flexBasis: '300px', minWidth: '300px', border: '1px solid #ccc', padding: '10px', background: '#B4D4FF', borderRadius: '10px' }}>
          <h3>List Number 2 ({listNumber2Items.length})</h3>
          <input
            type="checkbox"
            checked={selectedLists.includes(2)}
            onChange={() => handleListCheckboxChange(2)}
          />
          <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
          {listNumber2Items.map((item, index) => (
            <div key={index} style={{ border: '1px solid', padding: '10px', background: '#EEF5FF', borderRadius: '10px' }}>
              <p>Name: {item.name}</p>
              <p>Description: {item.description}</p>
              {isCreatingList && (
                
                  <img onClick={() => handleMoveListItemToList3(item)} src={require('../images/arrow.png')} alt="arrow" height={20} style={{ cursor: 'pointer' }} />
              )}
            </div>
          ))}
          </div>
        </div>
        

        {/* List Number 3 */}
        {list3Items.length > 0 && (
          <div style={{ flexBasis: '300px', minWidth: '300px', border: '1px solid #ccc', padding: '10px', background: '#B4D4FF', borderRadius: '10px' }}>
            <h3>List Number 3 ({list3Items.length})</h3>
            <input
              type="checkbox"
              checked={selectedLists.includes(3)}
              onChange={() => handleListCheckboxChange()}
            />
            <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
            {list3Items.map((item, index) => (
              <div key={index} style={{ border: '1px solid', padding: '10px', background: '#EEF5FF', borderRadius: '10px' }}>
                <p>Name: {item.name}</p>
                <p>Description: {item.description}</p>
                {/* {isCreatingList && (
                  <button onClick={() => handleMoveListItem(item, item.list_number, 1)} style={{ cursor: 'pointer' }}>Move to List 1</button>
                )} */}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {isCreatingList && (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', marginBottom: '50px' }}>
        <button className="btn btn-light" onClick={handleCancelListCreation} style={{ marginRight: '10px' }}>Cancel</button>
        <button className="btn btn-primary" onClick={handleUpdateList}>Update</button>
        </div>
      )}


      <div style={{ clear: 'both' }}></div>
    </div>
  );
};

export default ListContainer;