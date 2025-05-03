// apps/frontend/app/admin/dashboard/components/GlobalReferralTree.tsx
'use client'

import { useEffect, useState } from 'react'
import { getReferralTree } from '@/lib/api'

interface ReferralNode {
  id: string
  name: string
  swifin_id: string
  children?: ReferralNode[]
}

export default function GlobalReferralTree() {
  const [tree, setTree] = useState<ReferralNode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTree() {
      const data = await getReferralTree()
      setTree(data)
      setLoading(false)
    }
    fetchTree()
  }, [])

  function renderNode(node: ReferralNode, depth = 0) {
    return (
      <div key={node.id} className={`ml-${depth * 4} mb-2`}>
        <div className="font-medium text-gray-800">
          {node.name || node.swifin_id} <span className="text-sm text-gray-500">({node.swifin_id})</span>
        </div>
        {node.children && (
          <div className="ml-4 border-l border-gray-300 pl-4">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div className="text-gray-600">Loading referral tree...</div>
  if (!tree) return <div className="text-red-600">Failed to load referral tree.</div>

  return (
    <div className="max-h-[500px] overflow-y-auto text-sm">
      {renderNode(tree)}
    </div>
  )
}
