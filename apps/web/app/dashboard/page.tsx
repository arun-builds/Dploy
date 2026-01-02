'use client'

import { authClient } from "@/lib/auth-client" 
import { Website } from "@repo/database"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default  function Dashboard() {

    const [websites, setWebsites] = useState<Website[]>([])
    const [url, setUrl] = useState("")
    const router = useRouter()

    
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
    } = authClient.useSession() 

    useEffect(() => {
        async function fetchWebsites() {
            const response = await axios.get(`/api/getWebsite?userId=${session?.user.id}`)
            setWebsites(response.data)
        }
        fetchWebsites()
      }, [])

      useEffect(() => {
        async function fetchWebsites() {
            const response = await axios.get(`/api/getWebsite?userId=${session?.user.id}`)
            setWebsites(response.data)
        }
        fetchWebsites()
      }, [])
      

    if (isPending) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    if (!session) {
        return <div>Not logged in</div>
    }



  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
        const response = await axios.post(`/api/createWebsite`, { repoUrl: url })
        console.log("response:", response.data);
            router.push(`/website/${response.data.domainId}`)

    } catch (error) {
        console.error(error)
    }
  }

    return <div>
        <h1>Dashboard</h1>
        <div>Create a new website</div>
        <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button type="submit" onClick={handleCreate}>Create</button>
        </form>
        <div className="grid grid-cols-3 gap-4">
            {websites.map((website) => (
                <div key={website.id} className="border p-4 rounded-md cursor-pointer" onClick={() => router.push(`/website/${website.domainId}`)}>
                    <h2 className="text-lg font-bold">{website.domainId}</h2>
                </div>
            ))}
        </div>
    </div>;
}
