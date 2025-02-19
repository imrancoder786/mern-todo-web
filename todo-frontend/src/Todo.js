import { useEffect, useState } from "react"

export default function Todo(){
   const[title, setTitle] = useState("");
   const[description, setDescription] = useState("");
   const[todos, settodos] = useState([]);
   const[error, setError] = useState("");
   const[message, setmessage] = useState("");
   const[editId, setEditId] = useState(-1);

   //edit
   const[editTitle, setEditTitle] = useState("");
   const[editDescription, setEditDescription] = useState("");
   const apiUrl = "http://localhost:786"

    const handleSubmit = () =>{
        setError("")
        //check input
        if (title.trim() !== '' &&  description.trim() !== '') {
            fetch(apiUrl + '/todos',{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title , description})
            }).then((res) =>{
                if (res.ok) {
                   //add item to list
                   settodos([...todos, {title, description} ])
                   setTitle("");
                   setDescription("");
                   setmessage("Item added successfully!")
                   setTimeout(() => {
                    setmessage("");
                   }, 3000);
                }else{
                    //set error
                    setError("Unable to create Todo item")
                }
            

            }).catch(()=>{
                setError("Unable to create Todo item")
            })
        }
    }

    useEffect(() =>{
        getitems()
    }, [])

    const getitems = () => {
        fetch(apiUrl +"/todos")
        .then((res) => res.json())
        .then((res) => {
            settodos(res)
        })
    }

    const handleEdit = (item) =>{
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }


    const handleUpdate = () =>{
        setError("")
        //check input
        if (editTitle.trim() !== '' &&  editDescription.trim() !== '') {
            fetch(apiUrl + '/todos/' +editId,{
                method: "PUT",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: editTitle , description : editDescription})
            }).then((res) =>{
                if (res.ok) {
                   //UPDATE item to list
                   const updatedTodos = todos.map((item) =>{
                    if (item._id == editId) {
                        item.title = editTitle;
                        item.description = editDescription;
                    }
                    return item;
                   })


                   settodos(updatedTodos)
                   setEditTitle("");
                   setEditDescription("");
                   setmessage("Item Updated successfully!")
                   setTimeout(() => {
                    setmessage("");
                   }, 3000)

                   setEditId(-1)


                }else{
                    //set error
                    setError("Unable to create Todo item")
                }
            

            }).catch(()=>{
                setError("Unable to create Todo item")
            })
        }

    }
    const handleEditCancel = () =>{
        setEditId(-1)
    }

    const handleDelete = (id) =>{
        if (window.confirm("Are you sure want to Delete ?")) {
            fetch(apiUrl + '/todos/' + id,{
                method:"DELETE"
            })
            .then(()=>{
                const updatedTodos = todos.filter((item) =>item._id !==id)
                settodos(updatedTodos)
            })
        }

    }




    return <>
    <div className="row p-3 bg-success text-light">
        <h1>Todo project with MERN STACK!</h1>
    </div>
    <div className="row">
        <h3>ADD Item</h3>
        {message &&  <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-3">
            <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text"/>
            <input placeholder="Description" onChange={(e) =>setDescription(e.target.value)} value={description} className="form-control" type="text"/>
            <button className="btn btn-dark" onClick={handleSubmit}>Sumit</button>

        </div>
        {error && <p className="text-danger">{error}</p>}
        

    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md">
        <ul className="list-group">
            {
                todos.map((item) =><li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2" >
                <div className="d-flex flex-column me-2" >
                    {
                        editId == -1 ||editId !== item._id  ? <>
                            <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>
                        </> : <>
                        <div className="form-group d-flex gap-3">
                            <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text"/>
                            <input placeholder="Description" onChange={(e) =>setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text"/>

                        </div>



                        </>
                    }
                    
                </div>
                <div className="d-flex gap-3">
                    {editId == -1 ||editId !== item._id ? <button className="btn btn-warning" onClick={() =>handleEdit(item)}>Edit</button>:<button className="btn btn-success" onClick={handleUpdate}>Update</button>}
                    { editId == -1 ?<button className="btn btn-danger" onClick={() =>handleDelete(item._id)}>Delete</button>:
                    <button className="btn btn-danger" onClick={handleEditCancel}>Cancle</button>}
                </div>
                
            </li>
                
            )
            }
            


        </ul>

        </div>
        
    </div>
    </>
}