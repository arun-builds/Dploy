'use client'

import { useState } from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export default function CreateWebsite() {
    const [url, setUrl] = useState("")
    const router = useRouter()
    const handleCreate = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/website`, { url: url })
            if (response.status === 200) {
                router.push(`/website/${response.data}`)
            }
        } catch (error) {
            console.error(error)
        }
    }
    return <div>
        <h1>Create Website</h1>
        <form>
            <input type="text" placeholder="Website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button type="submit" onClick={handleCreate}>Create</button>
        </form>
    </div>
}
