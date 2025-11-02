import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const NOTES_FILE = path.join(process.cwd(), 'data', 'notes.json')

interface Note {
  id: string
  content: string
  category: string
  modelType?: string
  timestamp: string
  isArchived: boolean
}

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.access(NOTES_FILE)
  } catch {
    await fs.mkdir(path.dirname(NOTES_FILE), { recursive: true })
    await fs.writeFile(NOTES_FILE, '[]', 'utf-8')
  }
}

// GET - Fetch all notes
export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(NOTES_FILE, 'utf-8')
    const notes: Note[] = JSON.parse(data)

    return NextResponse.json(notes, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error) {
    console.error('Error reading notes:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - Add or update notes
export async function POST(req: Request) {
  try {
    await ensureDataFile()
    const body = await req.json()
    const { notes } = body

    if (!Array.isArray(notes)) {
      return NextResponse.json({ error: 'Invalid notes data' }, { status: 400 })
    }

    // Write notes to file
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8')

    return NextResponse.json({ success: true, count: notes.length })
  } catch (error) {
    console.error('Error saving notes:', error)
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 })
  }
}

// DELETE - Clear all notes
export async function DELETE() {
  try {
    await ensureDataFile()
    await fs.writeFile(NOTES_FILE, '[]', 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notes:', error)
    return NextResponse.json({ error: 'Failed to delete notes' }, { status: 500 })
  }
}
