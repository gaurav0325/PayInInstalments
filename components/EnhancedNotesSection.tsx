'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Note {
  id: string
  content: string
  category: string
  modelType?: string
  timestamp: Date
  isArchived: boolean
}

interface EnhancedNotesSectionProps {
  isCompact?: boolean
  modelContext?: string
}

export function EnhancedNotesSection({ isCompact = true, modelContext }: EnhancedNotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [isExpanded, setIsExpanded] = useState(!isCompact)
  const [showArchived, setShowArchived] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')

  const categories = [
    'General',
    'Merchant-Financed', 
    'Partner-Financed',
    'Acquirer-Driven',
    'Deposit & Flexible',
    'Bank-Driven',
    'Smart Routing'
  ]

  // Auto-categorize notes based on content
  const categorizeDemocratically = (content: string): string => {
    const lower = content.toLowerCase()
    if (lower.includes('merchant') || lower.includes('ba finance') || lower.includes('mit') || lower.includes('full auth')) {
      return 'Merchant-Financed'
    }
    if (lower.includes('bnpl') || lower.includes('klarna') || lower.includes('aplazame') || lower.includes('psp')) {
      return 'Partner-Financed'
    }
    if (lower.includes('amadeus') || lower.includes('acquirer')) {
      return 'Acquirer-Driven'
    }
    if (lower.includes('deposit') || lower.includes('holidays') || lower.includes('deferred')) {
      return 'Deposit & Flexible'
    }
    if (lower.includes('bank') || lower.includes('issuer')) {
      return 'Bank-Driven'
    }
    if (lower.includes('hybrid') || lower.includes('routing') || lower.includes('orchestrat')) {
      return 'Smart Routing'
    }
    return modelContext || 'General'
  }

  // Load notes from server
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotes(data.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })))
        }
      })
      .catch(e => console.error('Error loading notes:', e))
  }, [])

  // Save notes to server (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes.length >= 0) { // Save even empty array to allow deletion
        fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes })
        }).catch(e => console.error('Error saving notes:', e))
      }
    }, 500) // Debounce to avoid too many API calls

    return () => clearTimeout(timeoutId)
  }, [notes])

  const addNote = () => {
    if (!newNote.trim()) return

    // Auto spell check and correction (basic implementation)
    const correctedNote = newNote
      .replace(/\binstalment\b/gi, 'instalment')
      .replace(/\bpayement\b/gi, 'payment')
      .replace(/\bfinacial\b/gi, 'financial')

    const autoCategory = categorizeDemocratically(correctedNote)
    
    const note: Note = {
      id: Date.now().toString(),
      content: correctedNote,
      category: autoCategory,
      modelType: modelContext,
      timestamp: new Date(),
      isArchived: false
    }

    setNotes(prev => [note, ...prev])
    setNewNote('')
  }

  const archiveNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, isArchived: true } : note
    ))
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id)
    setEditingContent(note.content)
  }

  const cancelEditing = () => {
    setEditingNoteId(null)
    setEditingContent('')
  }

  const saveEdit = (id: string) => {
    if (!editingContent.trim()) return

    const correctedNote = editingContent
      .replace(/\binstalment\b/gi, 'instalment')
      .replace(/\bpayement\b/gi, 'payment')
      .replace(/\bfinacial\b/gi, 'financial')

    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, content: correctedNote } : note
    ))
    setEditingNoteId(null)
    setEditingContent('')
  }

  const exportNotes = async () => {
    setIsExporting(true)
    
    // AI-generated smart summary
    const summary = generateSmartSummary(notes.filter(n => !n.isArchived))
    const activeNotes = notes.filter(n => !n.isArchived)
    
    // Create readable text export
    let exportText = `Test Airlines INSTALMENTS PLAYGROUND - NOTES SUMMARY\n`
    exportText += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`
    exportText += `=`.repeat(60) + '\n\n'
    
    exportText += `EXECUTIVE SUMMARY\n`
    exportText += `-`.repeat(20) + '\n'
    exportText += `${summary}\n\n`
    
    exportText += `TOTAL NOTES: ${activeNotes.length}\n\n`
    
    // Group notes by category
    categories.forEach(category => {
      const categoryNotes = activeNotes.filter(n => n.category === category)
      if (categoryNotes.length > 0) {
        exportText += `${category.toUpperCase()} (${categoryNotes.length} notes)\n`
        exportText += `${'='.repeat(category.length + 10)}\n`
        
        categoryNotes.forEach((note, index) => {
          exportText += `${index + 1}. ${note.content}\n`
          exportText += `   Date: ${note.timestamp.toLocaleDateString()}`
          if (note.modelType) {
            exportText += ` | Model: ${note.modelType}`
          }
          exportText += '\n\n'
        })
        exportText += '\n'
      }
    })
    
    exportText += `${'='.repeat(60)}\n`
    exportText += `Export completed on ${new Date().toLocaleString()}\n`
    exportText += `Test Airlines Instalments Playground - Payment Models Analysis Tool`

    // Create and download text export
    const blob = new Blob([exportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Test Airlines-Instalments-Notes-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    setTimeout(() => setIsExporting(false), 1000)
  }

  const generateSmartSummary = (activeNotes: Note[]): string => {
    if (activeNotes.length === 0) return 'No notes available for summary.'
    
    const categoryBreakdown = categories.reduce((acc, cat) => {
      const count = activeNotes.filter(n => n.category === cat).length
      if (count > 0) acc[cat] = count
      return acc
    }, {} as any)

    const totalNotes = activeNotes.length
    const topCategory = Object.keys(categoryBreakdown).reduce((a, b) => 
      categoryBreakdown[a] > categoryBreakdown[b] ? a : b, Object.keys(categoryBreakdown)[0]
    )

    return `Analysis Summary: ${totalNotes} notes captured across ${Object.keys(categoryBreakdown).length} categories. Primary focus area: ${topCategory} (${categoryBreakdown[topCategory]} notes). Key insights cover payment model comparisons, risk assessments, and implementation considerations for various instalment solutions.`
  }

  const filteredNotes = notes.filter(note => 
    showArchived ? note.isArchived : !note.isArchived
  )

  if (isCompact && !isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-4 z-40"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Smart Notes ({filteredNotes.length})</span>
          </div>
        </button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, x: isCompact ? 100 : 0, scale: isCompact ? 0.9 : 1 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: isCompact ? 100 : 0, scale: isCompact ? 0.9 : 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`${isCompact ? 'fixed top-20 right-4 w-80 max-h-[70vh] z-50' : 'w-full'} bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-gray-900">Smart Notes</h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                  {filteredNotes.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportNotes}
                  disabled={isExporting || filteredNotes.length === 0}
                  className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium"
                >
                  {isExporting ? '⏳' : '📁'} Export
                </button>
                {isCompact && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`${isCompact ? 'max-h-96' : 'max-h-64'} overflow-y-auto p-4`}>
            {/* Add Note */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                  placeholder={`Add note${modelContext ? ` for ${modelContext}` : ''}...`}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </motion.button>
              </div>
              
              {/* Category filters */}
              <div className="flex gap-1 mb-2 flex-wrap">
                {categories.slice(0, 3).map(cat => {
                  const count = notes.filter(n => n.category === cat && !n.isArchived).length
                  return count > 0 ? (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  ) : null
                })}
              </div>

              {/* Archive toggle */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className="hover:text-blue-600"
                >
                  {showArchived ? '📋 Active' : '📦 Archived'} ({showArchived ? notes.filter(n => !n.isArchived).length : notes.filter(n => n.isArchived).length})
                </button>
                <div className="text-gray-400">
                  Auto-categorized • Spell-checked
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-2">
              <AnimatePresence>
                {filteredNotes
                  .filter(note => selectedCategory === 'All' || note.category === selectedCategory)
                  .map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          {editingNoteId === note.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(note.id)}
                                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-900 break-words">{note.content}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                  {note.category}
                                </span>
                                {note.modelType && (
                                  <span className="text-xs text-gray-500">
                                    {note.modelType}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  {note.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!note.isArchived && editingNoteId !== note.id && (
                            <button
                              onClick={() => startEditing(note)}
                              className="text-gray-400 hover:text-blue-600 text-xs"
                              title="Edit"
                            >
                              ✏️
                            </button>
                          )}
                          {!note.isArchived && editingNoteId !== note.id ? (
                            <button
                              onClick={() => archiveNote(note.id)}
                              className="text-gray-400 hover:text-yellow-600 text-xs"
                              title="Archive"
                            >
                              📦
                            </button>
                          ) : editingNoteId !== note.id && (
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="text-gray-400 hover:text-red-600 text-xs"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              
              {filteredNotes.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  {showArchived ? 'No archived notes' : 'No notes yet. Start by adding one above!'}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}