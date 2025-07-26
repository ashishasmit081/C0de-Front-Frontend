import { useState, useEffect } from "react"

export default function Signup(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(name, email, pass);
        //validation for all fields

        //Form Submit
        //backend me submit hogi
    }

    return(
    <>  {/* form will call handleSubmit as soon as submit button is clicked*/}
         <form onSubmit={handleSubmit} className="flex flex-col">
                                          {/*required marks it mandatory */}
            <input type="text"  value={name} required placeholder="Enter your first name" onChange={(e)=>setName(e.target.value)}></input>
            <input type="email"  value={email} required placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="password"  value={pass} required placeholder="Set your password" onChange={(e)=>setPass(e.target.value)}></input>
            <button type="submit">Submit</button>
        </form>
    </>
    )
}