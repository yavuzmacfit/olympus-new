"use client";

import { useState } from "react";
import {
  Phone,
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Settings2,
  Columns2,
  Filter,
  ArrowUpDown,
  Download,
  Copy,
  Save,
  X,
  FileText,
  Mail,
  CheckSquare,
  CalendarDays,
  Flame,
} from "lucide-react";

const contacts = [
  {
    id: 1,
    initials: "BH",
    color: "bg-red-800",
    name: "Brian Halligan (Sample Contact)",
    title: "Executive Chairperson at HubSpot",
    email: "bh@hubspot.com",
    phone: "--",
    owner: "No owner",
    company: "HubSpot",
    summary:
      "The most recent activity is a meeting scheduled for February 22, 2026, where the contact expressed enthusiasm about touring the cupcake factory. Prior to that, there was a call on February 19, 2026, with Brian Halligan discussing interest in the cupcake options and setting up a meeting next week.",
    summaryDate: "GENERATED FEB 24, 2026",
  },
  {
    id: 2,
    initials: "MJ",
    color: "bg-red-600",
    name: "Maria Johnson (Sample Contact)",
    title: "",
    email: "emailmaria@hubspot.com",
    phone: "--",
    owner: "No owner",
    company: "HubSpot",
    summary: "",
    summaryDate: "",
  },
];

type Contact = (typeof contacts)[0];

export default function AdayUyePage() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f5f8fa] rounded-tl-2xl">
      {/* Operasyon Banner */}
      <div className="mx-5 mt-4 bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#171a1d] rounded-xl shadow-sm flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Operasyon Zamanı!</h2>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
              <span>🎯 <span className="font-medium">Bugün Gelen:</span> <span className="font-bold text-slate-900">124</span></span>
              <span>🔥 <span className="font-medium">Hot Lead:</span> <span className="font-bold text-[#df1d2f]">37</span></span>
              <span>📞 <span className="font-medium">Bekleyen:</span> <span className="font-bold text-slate-900">52</span></span>
              <span>💰 <span className="font-medium">Satış:</span> <span className="font-bold text-emerald-600">9</span></span>
            </div>
            <p className="text-xs text-slate-400 mt-1 italic">
              Not: Aranmayan lead&#39;ler performans skorunu düşürür.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#df1d2f] hover:bg-[#b91827] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shrink-0">
          <Flame className="w-4 h-4" />
          Şimdi Aramaya Başla
        </button>
      </div>

      {/* Contacts Panel */}
      <div className="flex flex-1 gap-3 mx-5 mt-3 mb-5 overflow-hidden">
        <div className="bg-white rounded-xl flex flex-col overflow-hidden shadow-sm border border-slate-200 flex-1">
          {/* Toolbar Row 1 */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors">
                <span className="text-slate-500">👤</span>
                Contacts
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              <div className="flex items-center ml-2">
                {[
                  { id: "all", label: "All contacts", count: 2 },
                  { id: "my", label: "My contacts" },
                  { id: "unassigned", label: "Unassigned contacts" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-slate-100 border-b-2 border-[#df1d2f] text-slate-800 font-medium rounded-b-none"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                    {tab.count && (
                      <span className="text-[10px] bg-slate-200 text-slate-600 rounded-full px-1.5 py-0.5">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors ml-1">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 bg-[#df1d2f] hover:bg-[#b91827] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                Add contacts
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Toolbar Row 2 */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded w-44 focus:outline-none focus:ring-1 focus:ring-[#df1d2f]/30"
              />
            </div>
            {[
              { icon: Columns2, label: "Table view", hasChevron: true },
              { icon: Settings2, label: "", hasChevron: false },
              { icon: Columns2, label: "Edit columns", hasChevron: false },
              { icon: Filter, label: "Filters", hasChevron: false },
              { icon: ArrowUpDown, label: "Sort", hasChevron: false },
              { icon: Download, label: "Export", hasChevron: false },
              { icon: Copy, label: "", hasChevron: false },
            ].map(({ icon: Icon, label, hasChevron }, i) => (
              <button
                key={i}
                className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                {label && <span>{label}</span>}
                {hasChevron && <ChevronDown className="w-3 h-3" />}
              </button>
            ))}
            <button className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 rounded transition-colors">
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>

          {/* Toolbar Row 3 */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 shrink-0">
            {["Contact owner", "Create date", "Last activity date", "Lead status"].map((f) => (
              <button key={f} className="flex items-center gap-1 text-xs text-slate-600 border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-50 transition-colors">
                {f} <ChevronDown className="w-3 h-3" />
              </button>
            ))}
            <button className="text-xs text-[#df1d2f] hover:text-[#b91827] px-1">+ More</button>
            <span className="text-slate-200 mx-1">|</span>
            <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Advanced filters
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-10 p-3 text-left border-r border-slate-200">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  {["Name", "Email", "Phone Number", "Contact owner", "Primary company"].map((col) => (
                    <th key={col} className="p-3 text-left font-medium text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {col}
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                        <MoreHorizontal className="w-3 h-3 opacity-30" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id ? "bg-blue-50/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-3 border-r border-slate-100">
                      <input type="checkbox" className="rounded border-slate-300" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="p-3 border-r border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${contact.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {contact.initials}
                        </div>
                        <span className="text-blue-600 font-medium">{contact.name}</span>
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-blue-600">{contact.email}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-400">{contact.phone}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-500">{contact.owner}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-red-700 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">H</div>
                        <span className="text-slate-700">{contact.company}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="h-12 flex items-center justify-center gap-4 border-t border-slate-200 shrink-0">
            <button className="text-xs text-slate-500 hover:text-slate-700">‹ Prev</button>
            <button className="w-6 h-6 flex items-center justify-center text-xs bg-slate-100 rounded font-medium">1</button>
            <button className="text-xs text-slate-500 hover:text-slate-700">Next ›</button>
            <select className="ml-4 border border-slate-300 rounded px-1 py-0.5 text-xs outline-none">
              <option>25 per page</option>
              <option>50 per page</option>
            </select>
          </div>
        </div>

        {/* Right Panel */}
        {selectedContact && (
          <div className="w-[360px] bg-white rounded-xl flex flex-col overflow-hidden shadow-sm border border-slate-200 shrink-0">

            {/* Panel Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
              <p className="text-sm font-bold text-slate-900 leading-tight truncate pr-2">{selectedContact.name}</p>
              <button
                onClick={() => setSelectedContact(null as unknown as Contact)}
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* View record / Actions */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 shrink-0">
              <button className="text-xs text-blue-600 hover:underline font-medium">View record</button>
              <button className="text-xs text-slate-600 flex items-center gap-1 hover:text-slate-900 font-medium">
                Actions <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="px-4 pt-4 pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${selectedContact.color} rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {selectedContact.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-snug">{selectedContact.name}</p>
                  {selectedContact.title && (
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{selectedContact.title}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-blue-600">{selectedContact.email}</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </button>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-3 border-b border-slate-200 shrink-0">
              <div className="flex items-start justify-between gap-2 px-2">
                {[
                  { icon: FileText, label: "Note" },
                  { icon: Mail, label: "Email" },
                  { icon: Phone, label: "Call" },
                  { icon: CheckSquare, label: "Task" },
                  { icon: CalendarDays, label: "Meeting" },
                  { icon: MoreHorizontal, label: "More" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="text-[10px] text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breeze Summary */}
            <div className="flex-1 overflow-auto px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  Breeze record summary
                </span>
                <span className="text-[10px] text-pink-500 font-bold flex items-center gap-0.5">
                  ✦ AI
                </span>
              </div>
              {selectedContact.summary ? (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase">{selectedContact.summaryDate}</span>
                    <button className="text-[#df1d2f] hover:text-[#b91827] text-base leading-none">↻</button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedContact.summary}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No summary available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
