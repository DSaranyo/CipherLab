import React, { useState } from 'react';
import { CRYPTO_CONCEPTS } from '../../lib/concepts-data';
import { DataPanel } from '../../components/DataPanel';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const CryptoConcepts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('hash-functions');

  const categories = ['All', 'Hashing', 'Encryption', 'Integrity', 'Randomness', 'Key Management'];

  const filteredConcepts = CRYPTO_CONCEPTS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              CRYPTOGRAPHY CONCEPTS
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Curated technical encyclopedia of cryptographic standards, primitives, security boundaries, and operational risks.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#111815] border border-[#28342D]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="concepts-search-input" className="sr-only">Search cryptographic concepts</label>
          <Search className="w-4 h-4 text-[#667653] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="concepts-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, standards (e.g. FIPS, AES, CSPRNG)..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A968D] hover:text-[#E4E9E3] text-xs font-mono cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-mono uppercase transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#667653]/30 border-[#B7F397] text-[#B7F397] font-semibold'
                  : 'bg-[#17201B] border-[#28342D] text-[#8A968D] hover:text-[#E4E9E3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Items List */}
      <div className="space-y-4">
        {filteredConcepts.length === 0 ? (
          <div className="p-8 text-center bg-[#111815] border border-[#28342D] space-y-2 font-mono">
            <span className="text-xs text-[#8A968D]">No matching cryptographic concepts found for &quot;{searchQuery}&quot;.</span>
            <div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-[#A3B18A] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset search filters</span>
              </button>
            </div>
          </div>
        ) : (
          filteredConcepts.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#111815] border border-[#28342D] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-[#17201B] transition-colors cursor-pointer"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#667653] uppercase border border-[#28342D] px-1.5 py-0.2 shrink-0">
                        {item.category}
                      </span>
                      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E4E9E3] truncate">
                        {item.title}
                      </h2>
                    </div>
                    <p className="text-xs text-[#8A968D] line-clamp-1">
                      {item.summary}
                    </p>
                  </div>

                  <span className="text-xs font-mono text-[#A3B18A] shrink-0 self-start sm:self-auto">
                    {isExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-5 border-t border-[#28342D] bg-[#0D1210] space-y-4 font-mono text-xs">
                    {/* Summary */}
                    <div className="text-xs text-[#E4E9E3] leading-relaxed">
                      {item.summary}
                    </div>

                    {/* Technical Specification Points */}
                    <div className="space-y-2">
                      <div className="text-[10px] text-[#667653] uppercase tracking-wider">
                        KEY MECHANISMS & PRINCIPLES:
                      </div>
                      <ul className="space-y-1.5 pl-4 list-disc text-[#8A968D] text-[11px] leading-relaxed">
                        {item.details.map((detail, idx) => (
                          <li key={idx}>
                            <span className="text-[#E4E9E3]">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Operational Distinction in CipherLab */}
                    <div className="p-3 bg-[#080B0A] border border-[#28342D] flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#B7F397] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#B7F397] block">
                          CIPHERLAB IMPLEMENTATION STATUS:
                        </span>
                        <p className="text-[11px] text-[#8A968D]">
                          {item.inCipherLab}
                        </p>
                      </div>
                    </div>

                    {/* Security Consideration */}
                    <div className="p-3 bg-[#E5AE54]/5 border border-[#E5AE54]/30 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-[#E5AE54] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-[#E5AE54] block">
                          CRITICAL SECURITY CONSIDERATION:
                        </span>
                        <p className="text-[11px] text-[#E5AE54]/90 leading-relaxed">
                          {item.securityConsideration}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
