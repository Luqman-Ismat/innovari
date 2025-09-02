{\rtf1\ansi\ansicpg1252\cocoartf2864
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 "use client";\
\
import React, \{ useState, useEffect, useRef, createContext, useContext, useCallback, useMemo, FC, ReactNode \} from 'react';\
\
// --- TYPE DEFINITIONS ---\
interface Point \{ x: number; y: number; \}\
interface DisciplineData \{ [key: string]: any; \}\
interface Equipment \{ id: string; name: string; type: string; x: number; y: number; description: string; disciplines: \{ [key: string]: DisciplineData \}; isHovered?: boolean; \}\
interface Pipe \{ id: string; from: \{ eqId: string; connId: string; \}; to: \{ eqId: string; connId: string; \}; name: string; disciplines: \{ [key: string]: DisciplineData \}; \}\
interface Task \{ id: string; name: string; startDate: string; endDate: string; completed: boolean; team: string[]; \}\
interface Phase \{ id: string; name: string; startDate: string; endDate: string; tasks: Task[]; \}\
interface Project \{ id: string; name: string; description: string; startDate: string; endDate:string; phases: Phase[]; \}\
interface SecondaryPaneData \{\
    x: number;\
    y: number;\
    title: string;\
    data: DisciplineData;\
\}\
interface CostEstimate \{\
    tag: string;\
    description: string;\
    equipmentCost: number;\
    installationLabor: number;\
    pipingMaterials: number;\
    instrumentation: number;\
    total: number;\
\}\
\
// --- INITIAL MOCK DATA ---\
const INITIAL_EQUIPMENT: \{ [key: string]: Equipment \} = \{ 'T-201': \{ id: 'T-201', name: 'Storage Tank T-201', type: 'Tank', x: 150, y: 300, description: 'Primary storage vessel for raw material.', disciplines: \{ Process: \{ tag: 'T-201', volume: '5000 Gallons', contents: 'Chemical A' \}, Mechanical: \{ material: 'Carbon Steel', designCode: 'API 650' \} \} \}, 'P-101': \{ id: 'P-101', name: 'Centrifugal Pump P-101', type: 'Pump', x: 400, y: 350, description: 'Main process pump for fluid transfer.', disciplines: \{ Process: \{ tag: 'P-101', flowRate: '150 GPM', dischargePressure: '50 PSI' \}, Mechanical: \{ model: 'XYZ-2000', powerRating: '10 HP' \} \} \}, 'V-301': \{ id: 'V-301', name: 'Control Valve V-301', type: 'Valve', x: 600, y: 350, description: 'Automated valve for flow regulation.', disciplines: \{ Process: \{ tag: 'V-301', CvValue: '25', failSafe: 'Closed' \}, Instrumentation: \{ positioner: 'IP-301', inputSignal: '4-20mA' \} \} \}, 'E-401': \{ id: 'E-401', name: 'Heat Exchanger E-401', type: 'Exchanger', x: 800, y: 350, description: 'Shell and tube heat exchanger.', disciplines: \{ Process: \{ duty: '1.2 MMBTU/hr', service: 'Cooling Water' \}, Mechanical: \{ tubes: '240', material: 'Titanium' \} \} \}, \};\
const INITIAL_PIPING: \{ [key: string]: Pipe \} = \{ 'pipe-1': \{ id: 'pipe-1', from: \{eqId: 'T-201', connId: 'outlet_side'\}, to: \{eqId: 'P-101', connId: 'inlet'\}, name: 'Pump Suction Line', disciplines: \{ Piping: \{ 'Line Number': '100-W-3"', Size: '3"', Spec: 'A1A' \}\}\}, 'pipe-2': \{ id: 'pipe-2', from: \{eqId: 'P-101', connId: 'outlet'\}, to: \{eqId: 'V-301', connId: 'inlet'\}, name: 'Pump Discharge Line', disciplines: \{ Piping: \{ 'Line Number': '101-W-3"', Size: '3"', Spec: 'A1A' \}\}\}, 'pipe-3': \{ id: 'pipe-3', from: \{eqId: 'V-301', connId: 'outlet'\}, to: \{eqId: 'E-401', connId: 'inlet'\}, name: 'Exchanger Inlet Line', disciplines: \{ Piping: \{ 'Line Number': '102-W-3"', Size: '3"', Spec: 'A1A' \}\}\}, \};\
const INITIAL_PROJECTS: Project[] = [ \{ id: 'proj-001', name: 'Chemical Plant Expansion Phase 1', description: 'Expansion of existing chemical production facility to increase output by 30%.', startDate: '2025-01-15', endDate: '2026-06-30', phases: [ \{ id: 'phase-1', name: 'Detailed Engineering', startDate: '2025-02-01', endDate: '2025-08-30', tasks: [ \{ id: 'task-1a', name: 'Finalize P&IDs', startDate: '2025-02-15', endDate: '2025-04-10', completed: true, team: ['J. Doe'] \}, \{ id: 'task-1b', name: 'Equipment Specification', startDate: '2025-04-11', endDate: '2025-06-20', completed: true, team: ['S. Smith'] \}, \{ id: 'task-1c', name: 'Layout Design', startDate: '2025-06-21', endDate: '2025-08-25', completed: false, team: ['J. Doe', 'A. Lee'] \}, ] \}, \{ id: 'phase-2', name: 'Procurement', startDate: '2025-07-01', endDate: '2026-02-15', tasks: [ \{ id: 'task-2a', name: 'Vendor Selection for Pumps', startDate: '2025-08-15', endDate: '2025-10-15', completed: false, team: ['P. Procurement'] \}, \{ id: 'task-2b', name: 'Issue Purchase Orders', startDate: '2025-10-16', endDate: '2025-12-01', completed: false, team: ['P. Procurement'] \}, ] \}, ] \}, \{ id: 'proj-002', name: 'Refinery Unit Debottlenecking', description: 'Upgrading compressor and heat exchangers to increase unit throughput by 15%.', startDate: '2025-03-01', endDate: '2025-12-20', phases: [ \{ id: 'phase-3', name: 'Feasibility Study', startDate: '2025-03-01', endDate: '2025-04-30', tasks: [ \{ id: 'task-3a', name: 'Process Simulation', startDate: '2025-03-01', endDate: '2025-03-31', completed: true, team: ['A. Analyst'] \}, \{ id: 'task-3b', name: 'Cost Estimation', startDate: '2025-04-01', endDate: '2025-04-30', completed: true, team: ['C. Estimator'] \}, ] \}, \{ id: 'phase-4', name: 'Construction', startDate: '2025-09-01', endDate: '2025-12-15', tasks: [ \{ id: 'task-4a', name: 'Site Preparation', startDate: '2025-09-01', endDate: '2025-09-30', completed: false, team: ['Build Team'] \}, ] \}, ] \} ];\
\
// --- CONSTANTS & CONFIGURATION ---\
const EQUIPMENT_CONNECTORS = \{\
    // Vessels\
    Tank: [ \{ id: 'inlet_top', name: 'Top Inlet', type: 'inlet', x: 0, y: -40 \}, \{ id: 'inlet_side', name: 'Side Inlet', type: 'inlet', x: -60, y: 0 \}, \{ id: 'outlet_side', name: 'Side Outlet', type: 'outlet', x: 60, y: 20 \} ],\
    Separator: [ \{ id: 'inlet_mid', name: 'Feed', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet_gas', name: 'Gas Out', type: 'outlet', x: 50, y: -25 \}, \{ id: 'outlet_liquid', name: 'Liquid Out', type: 'outlet', x: 50, y: 25 \} ],\
    Reactor: [ \{ id: 'inlet_1', name: 'Inlet 1', type: 'inlet', x: -50, y: -20 \}, \{ id: 'inlet_2', name: 'Inlet 2', type: 'inlet', x: -50, y: 20 \}, \{ id: 'outlet_1', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    Reboiler: [ \{ id: 'inlet_liq', name: 'Liq In', type: 'inlet', x: 0, y: 50 \}, \{ id: 'outlet_vap', name: 'Vap Out', type: 'outlet', x: 0, y: -50 \}, \{ id: 'inlet_heat', name: 'Heat In', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet_heat', name: 'Heat Out', type: 'outlet', x: 50, y: 0 \} ],\
    Column: [ \{ id: 'inlet_mid', name: 'Feed Inlet', type: 'inlet', x: -25, y: 0 \}, \{ id: 'outlet_top', name: 'Overhead', type: 'outlet', x: 25, y: -100 \}, \{ id: 'outlet_bottom', name: 'Bottoms', type: 'outlet', x: 0, y: 125 \} ],\
    // Heat Transfer\
    Heater: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    Cooler: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    Exchanger: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: -10 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 10 \} ],\
    AirCooler: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    FiredHeater: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    // Rotating\
    Pump: [ \{ id: 'inlet', name: 'Suction', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Discharge', type: 'outlet', x: 50, y: 0 \} ],\
    Compressor: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    Expander: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -50, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 50, y: 0 \} ],\
    // Piping\
    Valve: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -40, y: 0 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 40, y: 0 \} ],\
    ReliefValve: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: 0, y: 25 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 0, y: -25 \} ],\
    Mixer: [ \{ id: 'inlet1', name: 'Inlet 1', type: 'inlet', x: -40, y: -15 \}, \{ id: 'inlet2', name: 'Inlet 2', type: 'inlet', x: -40, y: 15 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 40, y: 0 \} ],\
    Tee: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: -40, y: 0 \}, \{ id: 'outlet1', name: 'Outlet 1', type: 'outlet', x: 40, y: -15 \}, \{ id: 'outlet2', name: 'Outlet 2', type: 'outlet', x: 40, y: 15 \} ],\
    Default: [ \{ id: 'inlet', name: 'Inlet', type: 'inlet', x: 0, y: -25 \}, \{ id: 'outlet', name: 'Outlet', type: 'outlet', x: 0, y: 25 \} ],\
\};\
\
const EQUIPMENT_PALETTE = [\
    \{ category: 'Vessels', items: [ \{ type: 'Tank', name: 'Tank' \}, \{ type: 'Separator', name: 'Separator' \}, \{ type: 'Reactor', name: 'CSTR' \}, \{ type: 'Reboiler', name: 'Reboiler' \}, \{ type: 'Column', name: 'Column' \} ]\},\
    \{ category: 'Heat Transfer', items: [ \{ type: 'Heater', name: 'Heater' \}, \{ type: 'Cooler', name: 'Cooler' \}, \{ type: 'Exchanger', name: 'Heat Exchanger' \}, \{ type: 'AirCooler', name: 'Air Cooler' \}, \{ type: 'FiredHeater', name: 'Fired Heater' \} ]\},\
    \{ category: 'Rotating Equipment', items: [ \{ type: 'Pump', name: 'Pump' \}, \{ type: 'Compressor', name: 'Compressor' \}, \{ type: 'Expander', name: 'Expander' \} ]\},\
    \{ category: 'Piping', items: [ \{ type: 'Valve', name: 'Valve' \}, \{ type: 'ReliefValve', name: 'Relief Valve' \}, \{ type: 'Mixer', name: 'Mixer' \}, \{ type: 'Tee', name: 'Tee' \} ]\},\
];\
\
const equipmentSvgs: \{ [key: string]: FC<\{ eq: Partial<Equipment>, styles: any \}> \} = \{\
    // Vessels\
    Tank: (\{ eq, styles \}) => <path d=\{`M $\{eq.x! - 60\} $\{eq.y! - 40\} C $\{eq.x! - 60\} $\{eq.y! - 60\}, $\{eq.x! + 60\} $\{eq.y! - 60\}, $\{eq.x! + 60\} $\{eq.y! - 40\} L $\{eq.x! + 60\} $\{eq.y! + 40\} L $\{eq.x! - 60\} $\{eq.y! + 40\} Z`\} fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" />,\
    Separator: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><rect x="-40" y="-40" width="80" height="80" rx="10" ry="10" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><line x1="-40" y1="0" x2="40" y2="0" stroke=\{styles.stroke\} strokeWidth="1" strokeDasharray="4,2" /></g>,\
    Reactor: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><circle cx="0" cy="0" r="40" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M-15,-10 L-5,0 L-15,10" fill="none" stroke=\{styles.stroke\} /><path d="M5,-10 L15,0 L5,10" fill="none" stroke=\{styles.stroke\} /></g>,\
    Reboiler: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><rect x="-40" y="-40" width="80" height="80" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M -30 20 Q -15 -20, 0 20 T 30 -20" stroke=\{styles.strokeLight\} strokeWidth="2" fill="none" /></g>,\
    Column: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><rect x="-25" y="-125" width="50" height="250" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M -25 -75 L 25 -75 M -25 -25 L 25 -25 M -25 25 L 25 25 M -25 75 L 25 75" stroke=\{styles.stroke\} strokeWidth="1.5"/></g>,\
    // Heat Transfer\
    Heater: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><path d="M-50,0 L50,0 M-30,-20 L-30,20 M-10,-20 L-10,20 M10,-20 L10,20 M30,-20 L30,20" stroke=\{styles.stroke\} strokeWidth="2" fill="none" /><rect x="-50" y="-20" width="100" height="40" rx="5" fill="none" stroke=\{styles.stroke\} strokeWidth="2"/></g>,\
    Cooler: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><circle cx="0" cy="0" r="35" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M-25,-25 L25,25 M-25,25 L25,-25" stroke=\{styles.strokeLight\} strokeWidth="2" /></g>,\
    Exchanger: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><circle cx="0" cy="0" r="40" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M -30 20 Q -15 -20, 0 20 T 30 -20" stroke=\{styles.strokeLight\} strokeWidth="2" fill="none" /><path d="M -40 -10 L -50 -10 M 50 10 L 40 10" fill="none" stroke=\{styles.stroke\} strokeWidth="2"/></g>,\
    AirCooler: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><rect x="-50" y="-25" width="100" height="50" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M0,-25 L0,-35 M-15,-35 L15,-35" stroke=\{styles.stroke\} fill="none" /></g>,\
    FiredHeater: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><path d="M-40,40 L-40,-20 L0,-40 L40,-20 L40,40 Z" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M-25,40 L-25,0 L25,0 L25,40" fill="none" stroke=\{styles.stroke\} strokeWidth="1.5" /></g>,\
    // Rotating Equipment\
    Pump: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><circle cx="0" cy="0" r="35" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M 0,0 L -50,0 M 0,0 L 50,0 M-25,-25 L0,-35 L25,-25" fill="none" stroke=\{styles.stroke\} strokeWidth="2" /></g>,\
    Compressor: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><path d="M-50,25 L0,-25 L50,25 Z" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /></g>,\
    Expander: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><path d="M-50,-25 L0,25 L50,-25 Z" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /></g>,\
    // Piping\
    Valve: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><path d="M -20 0 L -40 0 M 20 0 L 40 0" stroke=\{styles.stroke\} strokeWidth="2" fill="none" /><path d="M -20 -20 L 20 20 M -20 20 L 20 -20" stroke=\{styles.stroke\} strokeWidth="8" /><path d="M 0 -30 L 0 30" stroke=\{styles.stroke\} strokeWidth="2" fill="none" /><rect x="-10" y="-40" width="20" height="10" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /></g>,\
    ReliefValve: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><path d="M0,25 L0,10 L-15,10 L15,-10 L0,-10 L0,-25" fill="none" stroke=\{styles.stroke\} strokeWidth="2" /><circle cx="0" cy="0" r="15" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2"/></g>,\
    Mixer: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><circle cx="0" cy="0" r="10" fill=\{styles.fill\} stroke=\{styles.stroke\} strokeWidth="2" /><path d="M-40,-15 L-10,0 L-40,15 M10,0 L40,0" fill="none" stroke=\{styles.stroke\} strokeWidth="2" /></g>,\
    Tee: (\{ eq, styles \}) => <g transform=\{`translate($\{eq.x\}, $\{eq.y\})`\}><circle cx="0" cy="0" r="4" fill=\{styles.stroke\} /><path d="M-40,0 L0,0 M0,-30 L0,30" fill="none" stroke=\{styles.stroke\} strokeWidth="2"/></g>,\
    // Default\
    Default: (\{ eq, styles \}) => <rect x=\{eq.x! - 25\} y=\{eq.y! - 25\} width="50" height="50" fill="gray" />,\
\};\
\
const PHASE_STYLES: \{ [key: string]: \{ color: string; abbr: string \} \} = \{ 'Detailed Engineering': \{ color: 'bg-blue-500', abbr: 'DE' \}, 'Procurement': \{ color: 'bg-purple-500', abbr: 'PR' \}, 'Feasibility Study': \{ color: 'bg-green-500', abbr: 'FS' \}, 'Construction': \{ color: 'bg-orange-500', abbr: 'CN' \}, 'Default': \{ color: 'bg-gray-500', abbr: 'NA' \},\};\
\
// --- CONTEXT & STATE MANAGEMENT ---\
interface AppContextType \{\
    isLoading: boolean;\
    currentModule: string;\
    setCurrentModule: React.Dispatch<React.SetStateAction<string>>;\
    selectedItem: \{ id: string | null; type: string | null \};\
    selectItem: (type: string | null, id: string | null) => void;\
    isDarkMode: boolean;\
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;\
    isEditing: boolean;\
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;\
    equipment: \{ [key: string]: Equipment \};\
    setEquipment: React.Dispatch<React.SetStateAction<\{ [key: string]: Equipment \}>>;\
    addEquipment: (type: string, name: string, x: number, y: number) => void;\
    pipes: \{ [key: string]: Pipe \};\
    setPipes: React.Dispatch<React.SetStateAction<\{ [key: string]: Pipe \}>>;\
    projects: Project[];\
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;\
    updateItem: (type: string, updatedItem: Equipment | Pipe) => void;\
    deleteItem: (type: string, id: string) => void;\
    selectedItemData: Equipment | Pipe | undefined;\
    secondaryPaneData: SecondaryPaneData | null;\
    setSecondaryPaneData: React.Dispatch<React.SetStateAction<SecondaryPaneData | null>>;\
\}\
\
const AppContext = createContext<AppContextType | undefined>(undefined);\
\
const AppProvider: FC<\{children: ReactNode\}> = (\{ children \}) => \{\
    const [isLoading, setIsLoading] = useState(true);\
    const [currentModule, setCurrentModule] = useState('Engineering');\
    const [selectedItem, setSelectedItem] = useState<\{ id: string | null; type: string | null \}>(\{ id: null, type: null \});\
    const [isDarkMode, setIsDarkMode] = useState(true);\
    const [isEditing, setIsEditing] = useState(false);\
    const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);\
    const [pipes, setPipes] = useState(INITIAL_PIPING);\
    const [projects, setProjects] = useState(INITIAL_PROJECTS);\
    const [secondaryPaneData, setSecondaryPaneData] = useState<SecondaryPaneData | null>(null);\
\
\
    useEffect(() => \{\
        const timer = setTimeout(() => setIsLoading(false), 1500);\
        return () => clearTimeout(timer);\
    \}, []);\
\
    const selectItem = useCallback((type: string | null, id: string | null) => \{\
        setSelectedItem(\{ type, id \});\
        if (!id) \{\
            setSecondaryPaneData(null); // Close secondary pane when main selection is cleared\
        \}\
    \}, []);\
\
    const addEquipment = useCallback((type: string, name: string, x: number, y: number) => \{\
        const newId = `$\{type.slice(0, 1)\}-$\{Date.now().toString().slice(-4)\}`;\
        if (newId && !equipment[newId]) \{\
            const newEquipment: Equipment = \{ id: newId, name: name || 'New Equipment', type: type || 'Default', x, y, description: 'A new piece of equipment.', disciplines: \{ Process: \{ tag: newId \}, Mechanical: \{\} \} \};\
            setEquipment(prev => (\{ ...prev, [newId]: newEquipment \}));\
            selectItem('equipment', newId);\
        \}\
    \}, [equipment, selectItem]);\
    \
    const updateItem = useCallback((type: string, updatedItem: Equipment | Pipe) => \{\
        const originalId = selectedItem.id;\
\
        if (type === 'equipment') \{\
            const eqItem = updatedItem as Equipment;\
            setEquipment(prev => \{\
                const newState = \{ ...prev \};\
                if (originalId && originalId !== eqItem.id) \{\
                    delete newState[originalId];\
                \}\
                newState[eqItem.id] = eqItem;\
                return newState;\
            \});\
            \
            if (originalId && originalId !== eqItem.id) \{\
                setPipes(prevPipes => \{\
                    const newPipes = \{ ...prevPipes \};\
                    Object.values(newPipes).forEach(p => \{\
                        if (p.from.eqId === originalId) newPipes[p.id].from.eqId = eqItem.id;\
                        if (p.to.eqId === originalId) newPipes[p.id].to.eqId = eqItem.id;\
                    \});\
                    return newPipes;\
                \});\
                selectItem('equipment', eqItem.id);\
            \}\
        \} else if (type === 'pipe') \{\
            setPipes(prev => (\{ ...prev, [updatedItem.id]: updatedItem as Pipe \}));\
        \}\
    \}, [selectedItem.id, selectItem]);\
\
    const deleteItem = useCallback((type: string, id: string) => \{\
        if (type === 'equipment') \{\
            setEquipment((\{ [id]: _, ...remaining \}) => remaining);\
            setPipes(prev => \{\
                const newPipes = \{ ...prev \};\
                Object.entries(newPipes).forEach(([pipeId, p]) => \{\
                    if (p.from.eqId === id || p.to.eqId === id) \{\
                        delete newPipes[pipeId];\
                    \}\
                \});\
                return newPipes;\
            \});\
        \} else if (type === 'pipe') \{\
            setPipes((\{ [id]: _, ...remaining \}) => remaining);\
        \}\
        selectItem(null, null);\
    \}, [selectItem]);\
\
    const selectedItemData = useMemo(() => \{\
        if (!selectedItem.type || !selectedItem.id) return undefined;\
        return selectedItem.type === 'equipment' ? equipment[selectedItem.id] : pipes[selectedItem.id];\
    \}, [selectedItem, equipment, pipes]);\
\
    const value: AppContextType = \{\
        isLoading, \
        currentModule, setCurrentModule,\
        selectedItem, selectItem,\
        isDarkMode, setIsDarkMode,\
        isEditing, setIsEditing,\
        equipment, setEquipment, addEquipment,\
        pipes, setPipes,\
        projects, setProjects,\
        updateItem, deleteItem,\
        selectedItemData,\
        secondaryPaneData, setSecondaryPaneData,\
    \};\
\
    return <AppContext.Provider value=\{value\}>\{children\}</AppContext.Provider>;\
\};\
\
const useAppContext = (): AppContextType => \{\
    const context = useContext(AppContext);\
    if (context === undefined) \{\
        throw new Error('useAppContext must be used within an AppProvider');\
    \}\
    return context;\
\};\
\
// --- GLOBAL & UI COMPONENTS ---\
\
const GlobalStyles: FC = () => ( <style>\{` @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap'); body \{ font-family: 'Space Grotesk', sans-serif; \} @keyframes bounce \{ 0%, 100% \{ transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); \} 50% \{ transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); \} \} .bounce-animation \{ animation: bounce 1s infinite; \} .highlight-equipment \{ filter: drop-shadow(0 0 8px #38bdf8); \} .selected-item-glow \{ filter: drop-shadow(0px 0px 12px rgba(255, 255, 255, 0.9)); \} `\}</style> );\
const LoadingScreen: FC = () => ( <div className="flex items-center justify-center min-h-screen bg-black text-white"> <div className="relative text-[20rem] font-bold leading-none"> <div className="absolute top-[-3.5rem] left-1/2 transform -translate-x-1/2 text-white bounce-animation">.</div> <div className="text-gray-900">i</div> </div> </div> );\
\
const Header: FC = () => \{\
    const \{ currentModule, setCurrentModule, isDarkMode, setIsDarkMode, isEditing, selectedItem \} = useAppContext();\
    const isItemSelected = selectedItem.id !== null;\
    const headerBgClass = isDarkMode ? 'bg-black/70 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';\
    const navButtonBaseClass = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';\
    const navButtonActiveClass = isDarkMode ? 'font-bold text-white' : 'font-bold text-black';\
    const logoDotColor = isEditing || isItemSelected ? 'text-red-500' : 'text-green-500';\
\
    return (\
        <header className=\{`$\{headerBgClass\} p-3 fixed top-0 left-0 right-0 z-[100]`\}>\
            <div className="w-full px-6 flex justify-between items-center">\
                <div className="flex items-center">\
                    <div className="relative text-4xl font-bold leading-none select-none pr-4">\
                        <span className=\{isDarkMode ? 'text-gray-400' : 'text-gray-700'\}>innoVari</span>\
                        <span\
                            className=\{`absolute text-5xl $\{logoDotColor\}`\}\
                            style=\{\{ top: '-1.2rem', right: '0' \}\}\
                        >\
                            .\
                        </span>\
                    </div>\
                </div>\
                <nav className="flex items-center space-x-6">\
                    \{['Engineering', 'Project Management', 'Estimating', 'Procurement', 'Construction'].map((module) => (\
                        <button key=\{module\} onClick=\{() => setCurrentModule(module)\} className=\{`$\{navButtonBaseClass\} transition-colors duration-200 focus:outline-none $\{currentModule === module ? navButtonActiveClass : ''\}`\}>\
                            \{module\}\
                        </button>\
                    ))\}\
                    <button onClick=\{() => setIsDarkMode(p => !p)\} className=\{`p-2 rounded-full transition-colors duration-200 focus:outline-none $\{isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'\}`\} aria-label="Toggle theme">\
                        \{isDarkMode ? <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> : <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>\}\
                    </button>\
                </nav>\
            </div>\
        </header>\
    );\
\}\
\
// --- ENGINEERING MODULE & SUB-COMPONENTS ---\
\
const getOrthogonalPath = (startPoint: Point, endPoint: Point) => \{\
    const midX = (startPoint.x + endPoint.x) / 2;\
    return `$\{startPoint.x\},$\{startPoint.y\} $\{midX\},$\{startPoint.y\} $\{midX\},$\{endPoint.y\} $\{endPoint.x\},$\{endPoint.y\}`;\
\};\
\
const SecondaryDetailsPane: FC<\{paneData: SecondaryPaneData\}> = (\{ paneData \}) => \{\
    const \{ setSecondaryPaneData, isDarkMode \} = useAppContext();\
    const \{ title, data \} = paneData;\
    const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-800';\
\
    return (\
        <div className=\{`rounded-lg shadow-2xl overflow-hidden $\{isDarkMode ? 'bg-gray-900/80 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-300'\} $\{textClass\}`\}>\
            <div className=\{`p-3 flex justify-between items-center $\{isDarkMode ? 'bg-gray-800' : 'bg-gray-200'\}`\}>\
                <h4 className="font-bold text-sm">\{title\}</h4>\
                <button onClick=\{() => setSecondaryPaneData(null)\} className=\{`p-1 rounded-full $\{isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'\}`\}>\
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>\
                </button>\
            </div>\
            <div className="p-4 space-y-2 text-xs overflow-y-auto" style=\{\{maxHeight: '200px'\}\}>\
                \{Object.entries(data).map(([key, value]) => (\
                    <div key=\{key\} className="flex justify-between">\
                        <strong className="capitalize font-semibold mr-2">\{key.replace(/([A-Z])/g, ' $1')\}:</strong> \
                        <span>\{String(value)\}</span>\
                    </div>\
                ))\}\
            </div>\
        </div>\
    );\
\};\
\
const EquipmentItem: FC<any> = React.memo((\{ eq, svgStyles, handleEquipmentMouseDown, handleMouseUp, setHoveredEqId, getCursor, selectedItemId, pipePreview, handleConnectorMouseDown \}) => \{\
    const RenderComponent = equipmentSvgs[eq.type] || equipmentSvgs.Default;\
    const \{ isDarkMode \} = useAppContext();\
    \
    return (\
        <g \
            onMouseDown=\{(e) => handleEquipmentMouseDown(e, eq.id)\} \
            onMouseUp=\{(e) => handleMouseUp(e, eq.id)\} \
            onMouseEnter=\{() => setHoveredEqId(eq.id)\} \
            onMouseLeave=\{() => setHoveredEqId(null)\} \
            className=\{`group $\{eq.id === selectedItemId ? 'selected-item-glow' : ''\}`\} \
            style=\{\{cursor: getCursor()\}\}\
        >\
            <RenderComponent eq=\{eq\} styles=\{svgStyles\} />\
            <text x=\{eq.x\} y=\{eq.y + (eq.type === 'Column' ? 140 : (eq.type === 'FiredHeater' ? 55 : 50) )\} textAnchor="middle" className="font-bold text-sm select-none" fill=\{svgStyles.text\}>\{eq.id\}</text>\
            \{(eq.isHovered || pipePreview?.from?.eqId === eq.id) && (EQUIPMENT_CONNECTORS[eq.type as keyof typeof EQUIPMENT_CONNECTORS] || []).map((conn, i) => (\
                <g key=\{i\} onMouseDown=\{(e) => handleConnectorMouseDown(e, eq.id, conn)\} onMouseUp=\{(e) => \{e.stopPropagation(); handleMouseUp(e, eq.id, conn.id)\}\} className="cursor-crosshair connector-group">\
                    <circle cx=\{eq.x + conn.x\} cy=\{eq.y + conn.y\} r="15" fill="transparent" />\
                    <circle cx=\{eq.x + conn.x\} cy=\{eq.y + conn.y\} r="8" fill=\{isDarkMode ? '#38bdf8' : '#0ea5e9'\} className="group-hover:connector-pulse" />\
                </g>\
            ))\}\
        </g>\
    );\
\});\
\
const PipeLine: FC<any> = React.memo((\{ pipe, equipment, svgStyles, selectedItemId, onSelect \}) => \{\
    const fromEq = equipment[pipe.from.eqId];\
    const toEq = equipment[pipe.to.eqId];\
    if (!fromEq || !toEq) return null;\
    const fromConn = (EQUIPMENT_CONNECTORS[fromEq.type as keyof typeof EQUIPMENT_CONNECTORS] || []).find(c => c.id === pipe.from.connId);\
    const toConn = (EQUIPMENT_CONNECTORS[toEq.type as keyof typeof EQUIPMENT_CONNECTORS] || []).find(c => c.id === pipe.to.connId);\
\
    if (!fromConn || !toConn) return null;\
\
    const p1 = \{ x: fromEq.x + fromConn.x, y: fromEq.y + fromConn.y \};\
    const p2 = \{ x: toEq.x + toConn.x, y: toEq.y + toConn.y \};\
\
    return (\
        <g onClick=\{onSelect\} className=\{`cursor-pointer $\{pipe.id === selectedItemId ? 'selected-item-glow' : ''\}`\}>\
            <polyline points=\{getOrthogonalPath(p1, p2)\} fill="none" stroke=\{pipe.id === selectedItemId ? svgStyles.selectedLine : svgStyles.line\} strokeWidth="5" />\
        </g>\
    );\
\});\
\
\
const EngineeringModule: FC = () => \{\
    const \{ equipment, setEquipment, pipes, setPipes, addEquipment, selectItem, selectedItem, isDarkMode, setIsEditing, secondaryPaneData, setSecondaryPaneData \} = useAppContext();\
    \
    const [draggingItem, setDraggingItem] = useState<\{id: string, offset: Point\} | null>(null);\
    const [isPanning, setIsPanning] = useState(false);\
    const [viewBox, setViewBox] = useState(\{ x: 0, y: 0, width: 1200, height: 700 \});\
    const [pipePreview, setPipePreview] = useState<\{ from: \{ eqId: string, connId: string \}, fromPoint: Point, toPoint: Point \} | null>(null);\
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);\
    const [hoveredEqId, setHoveredEqId] = useState<string | null>(null);\
    const [didDrag, setDidDrag] = useState(false);\
    const [snapLines, setSnapLines] = useState<\{x1:number, y1:number, x2:number, y2:number\}[]>([]);\
\
    const svgRef = useRef<SVGSVGElement>(null);\
    const startPoint = useRef<Point>(\{ x: 0, y: 0 \});\
    const startViewBox = useRef(viewBox);\
\
    useEffect(() => \{ setIsEditing(draggingItem !== null || pipePreview !== null); \}, [draggingItem, pipePreview, setIsEditing]);\
\
    const svgStyles = useMemo(() => (\{\
        bg: isDarkMode ? '#000' : '#FFF',\
        line: isDarkMode ? '#4b5563' : '#9ca3af',\
        selectedLine: isDarkMode ? '#38bdf8' : '#0ea5e9',\
        text: isDarkMode ? 'white' : 'black',\
        fill: isDarkMode ? '#111827' : '#f3f4f6',\
        stroke: isDarkMode ? '#4b5563' : '#d1d5db',\
        strokeLight: isDarkMode ? '#6b7280' : '#9ca3af',\
        snapLine: isDarkMode ? '#38bdf8' : '#0ea5e9',\
    \}), [isDarkMode]);\
\
    const getPointFromEvent = useCallback((e: React.MouseEvent | MouseEvent) => \{\
        if (!svgRef.current) return \{x:0, y:0\};\
        const CTM = svgRef.current.getScreenCTM();\
        if (!CTM) return \{x: 0, y: 0\};\
        return \{ x: (e.clientX - CTM.e) / CTM.a, y: (e.clientY - CTM.f) / CTM.d \};\
    \}, []);\
\
    const handleEquipmentMouseDown = useCallback((e: React.MouseEvent, id: string) => \{\
        e.stopPropagation();\
        setDidDrag(false);\
        const point = getPointFromEvent(e);\
        setDraggingItem(\{ id, offset: \{ x: equipment[id].x - point.x, y: equipment[id].y - point.y \} \});\
    \}, [getPointFromEvent, equipment]);\
    \
    const handleConnectorMouseDown = useCallback((e: React.MouseEvent, eqId: string, connector: any) => \{\
        e.stopPropagation();\
        const startPos = \{ x: equipment[eqId].x + connector.x, y: equipment[eqId].y + connector.y \};\
        setPipePreview(\{ from: \{eqId, connId: connector.id\}, fromPoint: startPos, toPoint: startPos \});\
    \}, [equipment]);\
\
    const handleSvgMouseDown = useCallback((e: React.MouseEvent) => \{\
        if (e.target === svgRef.current) \{\
            setIsPanning(true);\
            startPoint.current = \{ x: e.clientX, y: e.clientY \};\
            startViewBox.current = \{ ...viewBox \};\
            selectItem(null, null);\
        \}\
    \}, [selectItem, viewBox]);\
\
    const handleMouseMove = useCallback((e: React.MouseEvent) => \{\
        const point = getPointFromEvent(e);\
        if (pipePreview) \{\
            setPipePreview(p => p ? (\{ ...p, toPoint: point \}) : null);\
        \} else if (draggingItem) \{\
            if (!didDrag) setDidDrag(true);\
            let newX = point.x + draggingItem.offset.x;\
            let newY = point.y + draggingItem.offset.y;\
\
            // Snapping logic\
            const newSnapLines: \{x1:number, y1:number, x2:number, y2:number\}[] = [];\
            const snapThreshold = 10;\
            \
            Object.values(equipment).forEach(eq => \{\
                if (eq.id === draggingItem.id) return;\
\
                if (Math.abs(newX - eq.x) < snapThreshold) \{\
                    newX = eq.x;\
                    newSnapLines.push(\{ x1: newX, y1: Math.min(eq.y, newY), x2: newX, y2: Math.max(eq.y, newY) \});\
                \}\
                if (Math.abs(newY - eq.y) < snapThreshold) \{\
                    newY = eq.y;\
                    newSnapLines.push(\{ x1: Math.min(eq.x, newX), y1: newY, x2: Math.max(eq.x, newX), y2: newY \});\
                \}\
            \});\
            setSnapLines(newSnapLines);\
\
            setEquipment(prev => (\{ ...prev, [draggingItem.id]: \{ ...prev[draggingItem.id], x: newX, y: newY \} \}));\
        \} else if (isPanning && svgRef.current) \{\
            e.preventDefault();\
            const scale = viewBox.width / svgRef.current.clientWidth;\
            setViewBox(\{ ...startViewBox.current, x: startViewBox.current.x - (e.clientX - startPoint.current.x) * scale, y: startViewBox.current.y - (e.clientY - startPoint.current.y) * scale \});\
        \}\
    \}, [getPointFromEvent, pipePreview, draggingItem, isPanning, didDrag, setEquipment, viewBox, equipment]);\
    \
    const handleMouseUp = useCallback((e: React.MouseEvent, eqId?: string, connId?: string) => \{\
        if (pipePreview && eqId && connId) \{\
            if (pipePreview.from.eqId !== eqId) \{\
                const sourceEq = equipment[pipePreview.from.eqId];\
                const targetEq = equipment[eqId];\
                const sourceConnector = (EQUIPMENT_CONNECTORS[sourceEq.type as keyof typeof EQUIPMENT_CONNECTORS] || []).find(c => c.id === pipePreview.from.connId);\
                const targetConnector = (EQUIPMENT_CONNECTORS[targetEq.type as keyof typeof EQUIPMENT_CONNECTORS] || []).find(c => c.id === connId);\
                \
                if (sourceConnector && targetConnector && sourceConnector.type !== targetConnector.type) \{\
                    const newPipeId = `pipe-$\{Date.now()\}`;\
                    const newPipe: Pipe = \{ id: newPipeId, from: pipePreview.from, to: \{ eqId, connId \}, name: `New Pipe`, disciplines: \{ Piping: \{ 'Line Number': `$\{newPipeId\}-TEMP` \} \} \};\
                    setPipes(prev => (\{...prev, [newPipe.id]: newPipe\}));\
                \}\
            \}\
        \}\
        setPipePreview(null);\
\
        if (draggingItem && !didDrag) \{\
            selectItem('equipment', draggingItem.id);\
            setIsToolsMenuOpen(false); \
        \}\
\
        setIsPanning(false);\
        setDraggingItem(null);\
        setSnapLines([]);\
    \}, [pipePreview, draggingItem, didDrag, equipment, setPipes, selectItem]);\
    \
    const handleWheelZoom = useCallback((e: React.WheelEvent) => \{\
        e.preventDefault();\
        e.stopPropagation(); \
        const scale = e.deltaY > 0 ? 1.1 : 0.9;\
        const point = getPointFromEvent(e as any);\
        setViewBox(v => \{\
            const newWidth = v.width * scale;\
            const newHeight = v.height * scale;\
            const newX = point.x - (point.x - v.x) * scale;\
            const newY = point.y - (point.y - v.y) * scale;\
            return \{x: newX, y: newY, width: newWidth, height: newHeight\};\
        \});\
    \}, [getPointFromEvent]);\
    \
    const getCursor = useCallback(() => \{\
        if (draggingItem) return 'grabbing';\
        if (pipePreview) return 'crosshair';\
        if (isPanning) return 'grabbing';\
        return 'default';\
    \}, [draggingItem, pipePreview, isPanning]);\
\
    const handleDragStart = (e: React.DragEvent, itemType: string) => \{ e.dataTransfer.setData("application/json", JSON.stringify(\{type: itemType, name: `New $\{itemType\}`\})); \};\
    const handleDrop = useCallback((e: React.DragEvent) => \{\
        e.preventDefault();\
        const data = JSON.parse(e.dataTransfer.getData("application/json"));\
        const point = getPointFromEvent(e as any);\
        addEquipment(data.type, data.name, point.x, point.y);\
    \}, [addEquipment, getPointFromEvent]);\
\
    const handleFitToView = useCallback(() => \{\
        if (Object.keys(equipment).length === 0) \{\
            setViewBox(\{ x: 0, y: 0, width: 1200, height: 700 \});\
            return;\
        \}\
    \
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;\
    \
        Object.values(equipment).forEach(eq => \{\
            minX = Math.min(minX, eq.x);\
            minY = Math.min(minY, eq.y);\
            maxX = Math.max(maxX, eq.x);\
            maxY = Math.max(maxY, eq.y);\
        \});\
        \
        const padding = 150;\
        const contentWidth = (maxX - minX) + padding * 2;\
        const contentHeight = (maxY - minY) + padding * 2;\
        \
        setViewBox(\{\
            x: minX - padding,\
            y: minY - padding,\
            width: contentWidth,\
            height: contentHeight\
        \});\
    \}, [equipment]);\
\
    const equipmentWithHover = useMemo(() => \{\
        return Object.values(equipment).map(eq => (\{ ...eq, isHovered: eq.id === hoveredEqId \}));\
    \}, [equipment, hoveredEqId]);\
\
    return (\
        <div className="w-full h-full relative">\
            <div className="absolute top-4 left-4 z-10 p-4 rounded-lg bg-black/50 backdrop-blur-sm">\
                <h2 className="text-xl font-bold text-white">P&ID - Main Process</h2>\
            </div>\
            <div className="absolute top-4 right-4 z-20 flex gap-2">\
                 <button onClick=\{handleFitToView\} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-gray-700" title="Return to View">\
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4-4l-5 5M4 16v4m0 0h4m-4-4l5-5m11 5v4m0 0h-4m4-4l-5-5"></path></svg>\
                </button>\
                <button onClick=\{() => setIsToolsMenuOpen(p => !p)\} className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-gray-700" title="Tools">\
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>\
                </button>\
                \{isToolsMenuOpen && <ToolsMenu onDragStart=\{handleDragStart\} />\}\
            </div>\
            <svg ref=\{svgRef\} onMouseDown=\{handleSvgMouseDown\} onDragOver=\{(e) => e.preventDefault()\} onDrop=\{handleDrop\} onMouseMove=\{handleMouseMove\} onMouseUp=\{e => handleMouseUp(e)\} onMouseLeave=\{e => handleMouseUp(e)\} onWheel=\{handleWheelZoom\} viewBox=\{`$\{viewBox.x\} $\{viewBox.y\} $\{viewBox.width\} $\{viewBox.height\}`\} className="w-full h-full" style=\{\{backgroundColor: svgStyles.bg, cursor: getCursor()\}\}>\
                \{Object.values(pipes).map(pipe => (\
                    <PipeLine key=\{pipe.id\} pipe=\{pipe\} equipment=\{equipment\} svgStyles=\{svgStyles\} selectedItemId=\{selectedItem.id\} onSelect=\{(e: React.MouseEvent) => \{ e.stopPropagation(); selectItem('pipe', pipe.id); \}\} />\
                ))\}\
                \{equipmentWithHover.map(eq => (\
                   <EquipmentItem \
                        key=\{eq.id\}\
                        eq=\{eq\} \
                        svgStyles=\{svgStyles\} \
                        handleEquipmentMouseDown=\{handleEquipmentMouseDown\} \
                        handleMouseUp=\{handleMouseUp\} \
                        setHoveredEqId=\{setHoveredEqId\}\
                        getCursor=\{getCursor\}\
                        selectedItemId=\{selectedItem.id\}\
                        pipePreview=\{pipePreview\}\
                        handleConnectorMouseDown=\{handleConnectorMouseDown\}\
                    />\
                ))\}\
                \{snapLines.map((line, i) => (\
                    <line key=\{`snap-$\{i\}`\} x1=\{line.x1\} y1=\{line.y1\} x2=\{line.x2\} y2=\{line.y2\} stroke=\{svgStyles.snapLine\} strokeWidth="1" strokeDasharray="5,5" />\
                ))\}\
                \{pipePreview && <polyline points=\{getOrthogonalPath(pipePreview.fromPoint, pipePreview.toPoint)\} stroke=\{svgStyles.selectedLine\} strokeWidth="3" strokeDasharray="5,5" fill="none" />\}\
                \{secondaryPaneData && (\
                    <foreignObject x=\{secondaryPaneData.x\} y=\{secondaryPaneData.y\} width="250" height="250">\
                       <SecondaryDetailsPane paneData=\{secondaryPaneData\} />\
                    </foreignObject>\
                )\}\
            </svg>\
        </div>\
    );\
\};\
\
\
const ToolsMenu: FC<\{onDragStart: (e: React.DragEvent, itemType: string) => void\}> = (\{ onDragStart \}) => \{\
    const \{ isDarkMode \} = useAppContext();\
    const menuBg = isDarkMode ? 'bg-black/70 backdrop-blur-sm border border-gray-800' : 'bg-white/70 backdrop-blur-sm border border-gray-200';\
    const textColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';\
    const itemBg = isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-100';\
    const svgStyles = \{ fill: isDarkMode ? '#111827' : '#f3f4f6', stroke: isDarkMode ? '#4b5563' : '#d1d5db' \};\
\
    return (\
        <div className=\{`absolute top-12 right-0 w-64 rounded-lg shadow-2xl $\{menuBg\} p-4 flex flex-col`\}>\
            <div className="space-y-4 overflow-y-auto max-h-96">\
                \{EQUIPMENT_PALETTE.map(category => (\
                    <div key=\{category.category\}>\
                        <h4 className=\{`text-sm font-bold text-gray-500 uppercase tracking-wider px-2 mb-2`\}>\{category.category\}</h4>\
                        \{category.items.map(item => \{\
                            const Icon = equipmentSvgs[item.type];\
                            const mockEq = \{ x: 0, y: 0, type: item.type, id: 'palette-icon', name:'', description:'', disciplines:\{\} \};\
                            return (\
                                <div key=\{item.type\} draggable onDragStart=\{(e) => onDragStart(e, item.type)\} className=\{`p-2 rounded-lg flex items-center gap-4 cursor-grab $\{itemBg\}`\}>\
                                    <svg viewBox="-60 -60 120 120" className="w-12 h-12 flex-shrink-0">\
                                        <Icon eq=\{mockEq\} styles=\{svgStyles\} />\
                                    </svg>\
                                    <span className=\{`text-sm font-semibold $\{textColor\}`\}>\{item.name\}</span>\
                                </div>\
                            )\
                        \})\}\
                    </div>\
                ))\}\
            </div>\
        </div>\
    );\
\};\
\
// --- PROJECT MANAGEMENT & OTHER MODULES ---\
\
const ProjectManagementModule: FC = () => \{\
    const \{ isDarkMode, projects, setProjects \} = useAppContext();\
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);\
    const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);\
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);\
\
    const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);\
    const selectedPhase = useMemo(() => selectedProject?.phases.find(p => p.id === selectedPhaseId), [selectedProject, selectedPhaseId]);\
\
    useEffect(() => \{\
      if (selectedProject && selectedProject.phases.length > 0 && !selectedPhaseId) \{\
        setSelectedPhaseId(selectedProject.phases[0].id);\
      \}\
    \}, [selectedProject, selectedPhaseId]);\
    \
    const containerBg = isDarkMode ? 'bg-black' : 'bg-gray-50';\
    const textPrimary = isDarkMode ? 'text-white' : 'text-gray-100';\
    const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';\
    const buttonClass = isDarkMode \
        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' \
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300';\
\
    const handleSuggestTasks = async () => \{\
        if (!selectedProject || !selectedPhase) return;\
        setIsLoadingSuggestions(true);\
        \
        const apiKey = "";\
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$\{apiKey\}`;\
        const prompt = `For an EPC project phase called "$\{selectedPhase.name\}" within a project named "$\{selectedProject.name\}", suggest a list of 3 to 5 key tasks. The project is described as: "$\{selectedProject.description\}".`;\
        const payload = \{ contents: [\{ role: "user", parts: [\{ text: prompt \}] \}], generationConfig: \{ responseMimeType: "application/json", responseSchema: \{ type: "OBJECT", properties: \{ tasks: \{ type: "ARRAY", items: \{ type: "STRING" \}\}\}, required: ["tasks"] \} \} \};\
\
        try \{\
            const response = await fetch(apiUrl, \{ method: 'POST', headers: \{ 'Content-Type': 'application/json' \}, body: JSON.stringify(payload) \});\
            if (!response.ok) throw new Error(`API Error: $\{response.status\}`);\
            const result = await response.json();\
            \
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) \{\
                const generated = JSON.parse(result.candidates[0].content.parts[0].text);\
                const newTasks: Task[] = generated.tasks.map((taskName: string) => (\{ id: `task-$\{Date.now()\}-$\{Math.random()\}`, name: taskName, startDate: selectedPhase.startDate, endDate: selectedPhase.endDate, completed: false, team: [] \}));\
                setProjects(currentProjects => currentProjects.map(p => \
                    p.id === selectedProjectId ? \{ ...p, phases: p.phases.map(phase => \
                        phase.id === selectedPhaseId ? \{ ...phase, tasks: [...phase.tasks, ...newTasks] \} : phase\
                    )\} : p\
                ));\
            \}\
        \} catch (error) \{\
            console.error("Failed to suggest tasks:", error);\
        \} finally \{\
            setIsLoadingSuggestions(false);\
        \}\
    \};\
\
    if (!selectedProject) \{\
        return <div className=\{`w-full h-full flex items-center justify-center $\{containerBg\} $\{textSecondary\}`\}>Please select a project.</div>\
    \}\
\
    return (\
      <div className=\{`w-full h-full flex flex-col $\{containerBg\} $\{textPrimary\}`\}>\
          <div className="flex justify-between items-center p-6 border-b border-gray-800">\
              <h1 className="text-2xl font-bold">\{selectedProject.name\}</h1>\
               <select \
                 value=\{selectedProjectId || ''\} \
                 onChange=\{e => setSelectedProjectId(e.target.value)\} \
                 className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"\
               >\
                   \{projects.map(p => <option key=\{p.id\} value=\{p.id\}>\{p.name\}</option>)\}\
               </select>\
          </div>\
          <div className="flex-grow flex">\
              <div className="w-1/4 p-6 space-y-8 border-r border-gray-800">\
                  <div>\
                    <h2 className="text-lg font-bold mb-4">Phases</h2>\
                    <div className="space-y-2">\
                        \{selectedProject.phases.map(phase => (\
                            <button \
                              key=\{phase.id\} \
                              onClick=\{() => setSelectedPhaseId(phase.id)\} \
                              className=\{`w-full text-left p-2 rounded-md text-sm $\{selectedPhaseId === phase.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'\}`\}\
                            >\
                                \{phase.name\}\
                            </button>\
                        ))\}\
                    </div>\
                  </div>\
                  \{selectedPhase && (\
                    <div>\
                      <h2 className="text-lg font-bold mb-4">Tasks for \{selectedPhase.name\}</h2>\
                      <button onClick=\{handleSuggestTasks\} disabled=\{isLoadingSuggestions\} className=\{`w-full mb-4 px-3 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 $\{buttonClass\} disabled:opacity-50 disabled:cursor-not-allowed`\}>\
                           \{isLoadingSuggestions ? 'Generating...' : '\uc0\u10024  Suggest Tasks'\}\
                       </button>\
                       <div className="space-y-3">\
                        \{selectedPhase.tasks.length > 0 ? selectedPhase.tasks.map(task => \{\
                           const phaseStyle = PHASE_STYLES[selectedPhase.name] || PHASE_STYLES.Default;\
                           return(\
                            <div key=\{task.id\} className="flex items-center gap-2 text-sm text-gray-300">\
                              <div className=\{`w-4 h-4 rounded $\{phaseStyle.color\} flex-shrink-0`\}></div>\
                              <span>\{task.name\}</span>\
                            </div>\
                           )\
                        \}) : <div className="text-sm text-gray-500 italic">No tasks in this phase.</div>\}\
                       </div>\
                    </div>\
                  )\}\
              </div>\
              <div className="w-3/4 p-6 overflow-x-auto">\
                  <GanttChart project=\{selectedProject\} />\
              </div>\
          </div>\
      </div>\
    );\
\};\
\
const GanttChart: FC<\{project: Project\}> = (\{ project \}) => \{\
    const ganttRef = useRef<HTMLDivElement>(null);\
\
    const \{ projectStart, projectEnd, totalDuration, timelineMonths \} = useMemo(() => \{\
        if (!project || !project.phases || project.phases.length === 0) return \{ projectStart: new Date(), projectEnd: new Date(), totalDuration: 0, timelineMonths: [] \};\
\
        const allDates = project.phases.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);\
        const projectStart = new Date(Math.min(...allDates.map(d => d.getTime())));\
        const projectEnd = new Date(Math.max(...allDates.map(d => d.getTime())));\
        \
        projectStart.setDate(1); \
        projectEnd.setMonth(projectEnd.getMonth() + 1, 0);\
\
        const totalDuration = (projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24);\
\
        const months = [];\
        let currentDate = new Date(projectStart);\
        while (currentDate <= projectEnd) \{\
            months.push(new Date(currentDate));\
            currentDate.setMonth(currentDate.getMonth() + 1);\
        \}\
\
        return \{ projectStart, projectEnd, totalDuration, timelineMonths: months \};\
    \}, [project]);\
\
    if (!project) return null;\
\
    return (\
        <div className="text-white w-full h-full" ref=\{ganttRef\}>\
            <div className="grid" style=\{\{gridTemplateColumns: `repeat($\{timelineMonths.length\}, 1fr)`\}\}>\
                \{timelineMonths.map((month, i) => (\
                    <div key=\{i\} className="text-center text-xs text-gray-400 pb-4 border-b border-gray-800">\{month.toLocaleString('default', \{ month: 'short', year: '2-digit' \})\}</div>\
                ))\}\
            </div>\
\
            <div className="mt-6 space-y-8 relative">\
                \{project.phases.map((phase) => \{\
                    const phaseStyle = PHASE_STYLES[phase.name] || PHASE_STYLES.Default;\
                    const phaseHeight = phase.tasks.length * 2.5 + 2;\
\
                    return (\
                        <div key=\{phase.id\} style=\{\{height: `$\{phaseHeight\}rem`\}\}>\
                            <p className="font-bold text-gray-300 mb-3">\{phaseStyle.abbr\}: \{phase.name\}</p>\
                            <div className="space-y-2 relative h-full">\
                                \{phase.tasks.map((task, index) => \{\
                                    const taskStart = new Date(task.startDate);\
                                    const taskEnd = new Date(task.endDate);\
\
                                    const startOffset = ((taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24) / totalDuration) * 100;\
                                    const taskDuration = ((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) / totalDuration) * 100;\
\
                                    return (\
                                        <div key=\{task.id\} className="h-8 flex items-center group absolute w-full" style=\{\{top: `$\{index * 2.5\}rem`\}\}>\
                                            <div\
                                                className=\{`absolute h-6 rounded $\{phaseStyle.color\} transition-all duration-300 hover:opacity-80`\}\
                                                style=\{\{\
                                                    left: `$\{startOffset\}%`,\
                                                    width: `$\{taskDuration\}%`,\
                                                \}\}\
                                            >\
                                             <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-gray-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">\
                                                \{task.name\}\
                                             </span>\
                                            </div>\
                                        </div>\
                                    );\
                                \})\}\
                            </div>\
                        </div>\
                    );\
                \})\}\
            </div>\
        </div>\
    );\
\};\
\
\
const DetailsPane: FC = () => \{\
    const \{ selectedItemData, selectedItem, selectItem, updateItem, deleteItem, isDarkMode, setIsEditing, setSecondaryPaneData, pipes, equipment \} = useAppContext();\
    const [isEditMode, setIsEditMode] = useState(false);\
\
    useEffect(() => \{ setIsEditing(isEditMode); \}, [isEditMode, setIsEditing]);\
    \
    const handleViewDiscipline = useCallback((discipline: string, data: DisciplineData) => \{\
        const eq = selectedItemData as Equipment;\
        if(!eq) return;\
\
        // Smart placement logic\
        const paneWidth = 250;\
        const paneHeight = 250; \
        const offset = 90;\
\
        const candidatePositions = [\
            \{ x: eq.x + offset, y: eq.y - paneHeight/2 \}, // Right-center\
            \{ x: eq.x - paneWidth - offset, y: eq.y - paneHeight/2 \}, // Left-center\
            \{ x: eq.x - paneWidth/2, y: eq.y - paneHeight - offset \}, // Top-center\
            // Conditionally add bottom position only if details pane is closed\
            ...(selectedItemData ? [] : [\{ x: eq.x - paneWidth/2, y: eq.y + offset \}]), \
        ];\
        \
        const eqBoundingBoxes = Object.values(equipment)\
            .filter(e => e.id !== eq.id)\
            .map(e => (\{ x: e.x - 70, y: e.y - 70, width: 140, height: 140 \}));\
\
        let bestPosition = candidatePositions[0]; \
        \
        for(const pos of candidatePositions) \{\
            let hasOverlap = false;\
            const paneRect = \{ x: pos.x, y: pos.y, width: paneWidth, height: paneHeight \};\
            for(const eqRect of eqBoundingBoxes)\{\
                 if (\
                    paneRect.x < eqRect.x + eqRect.width &&\
                    paneRect.x + paneRect.width > eqRect.x &&\
                    paneRect.y < eqRect.y + eqRect.height &&\
                    paneRect.y + paneRect.height > eqRect.y\
                ) \{\
                    hasOverlap = true;\
                    break;\
                \}\
            \}\
            if(!hasOverlap)\{\
                bestPosition = pos;\
                break;\
            \}\
        \}\
\
        setSecondaryPaneData(\{\
            x: bestPosition.x,\
            y: bestPosition.y,\
            title: `$\{discipline\} Information`,\
            data: data\
        \});\
    \}, [selectedItemData, equipment, setSecondaryPaneData]);\
\
    const connectedPipes = useMemo(() => \{\
        if (!selectedItemData || selectedItem.type !== 'equipment') return [];\
        return Object.values(pipes).filter(p => p.from.eqId === selectedItemData.id || p.to.eqId === selectedItemData.id);\
    \}, [pipes, selectedItemData, selectedItem.type]);\
\
    useEffect(() => \{ \
        setIsEditMode(false);\
        setSecondaryPaneData(null); \
    \}, [selectedItem.id, setSecondaryPaneData]);\
\
    if (!selectedItemData) return null;\
\
    const itemType = selectedItem.type;\
    const handleDelete = () => \{ if(itemType && selectedItemData.id) deleteItem(itemType, selectedItemData.id); \};\
    const handleSave = (updatedItem: Equipment | Pipe) => \{ if(itemType) updateItem(itemType, updatedItem); setIsEditMode(false); \};\
    \
    const sidebarBgClass = isDarkMode ? 'bg-black/80 backdrop-blur-sm border-t border-gray-800' : 'bg-white/80 backdrop-blur-sm border-t border-gray-200';\
    const name = itemType === 'equipment' ? (selectedItemData as Equipment).name : `Pipe: $\{selectedItemData.id\}`;\
    const description = itemType === 'equipment' ? (selectedItemData as Equipment).description : `Connecting $\{(selectedItemData as Pipe).from.eqId\} to $\{(selectedItemData as Pipe).to.eqId\}`;\
\
    return (\
        <div className=\{`fixed bottom-0 left-0 w-full shadow-2xl transform transition-transform duration-300 $\{selectedItemData ? 'translate-y-0' : 'translate-y-full'\} $\{sidebarBgClass\} $\{isDarkMode ? 'text-white' : 'text-black'\} flex flex-col z-50`\} style=\{\{height: '40vh'\}\}>\
            <div className="p-4 border-b flex-shrink-0" style=\{\{borderColor: isDarkMode ? '#2d3748' : '#e2e6ea'\}\}>\
                <div className="flex justify-between items-center">\
                    <h3 className="text-lg font-bold">\{name\}</h3>\
                    <button onClick=\{() => selectItem(null, null)\} className=\{`p-1 rounded-full $\{isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'\}`\}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>\
                </div>\
                \{!isEditMode && <p className=\{`text-sm $\{isDarkMode ? 'text-gray-400' : 'text-gray-500'\} mt-1`\}>\{description\}</p>\}\
                \
                \{!isEditMode && itemType === 'equipment' && connectedPipes.length > 0 &&\
                     <div className="mt-2">\
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">Connections</h4>\
                        <div className="text-sm text-gray-400">\
                           \{connectedPipes.map(p => \{\
                               const otherEndId = p.from.eqId === selectedItemData.id ? p.to.eqId : p.from.eqId;\
                               return <div key=\{p.id\}>Connected to <span className="font-semibold text-gray-300">\{otherEndId\}</span> via \{p.id\}</div>\
                           \})\}\
                        </div>\
                    </div>\
                \}\
            </div>\
            <div className="flex-grow overflow-y-auto p-6">\
                \{isEditMode ? <ItemForm item=\{selectedItemData\} itemType=\{itemType || ''\} onSave=\{handleSave\} onCancel=\{() => setIsEditMode(false)\} /> : \
                    <div className="space-y-2">\
                        \{Object.entries(selectedItemData.disciplines).map(([discipline, data]) => (\
                             <button key=\{discipline\} onClick=\{() => handleViewDiscipline(discipline, data)\} className=\{`w-full text-left p-3 rounded-md transition-colors $\{isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'\}`\}>\
                                View <span className="font-bold">\{discipline\}</span> Information\
                            </button>\
                        ))\}\
                    </div>\
                \}\
            </div>\
            <div className="p-4 border-t flex-shrink-0 flex gap-4" style=\{\{borderColor: isDarkMode ? '#2d3748' : '#e2e6ea'\}\}>\
                \{!isEditMode && <button onClick=\{() => setIsEditMode(true)\} className=\{`w-full py-2 font-bold rounded $\{isDarkMode ? 'bg-white text-black' : 'bg-black text-white'\}`\}>Edit</button>\}\
                <button onClick=\{handleDelete\} className="w-full py-2 font-bold rounded bg-red-600 text-white hover:bg-red-700">Delete</button>\
            </div>\
        </div>\
    );\
\};\
\
const ItemForm: FC<\{item: Equipment | Pipe, itemType: string, onSave: (item: Equipment | Pipe) => void, onCancel: () => void\}> = (\{ item, itemType, onSave, onCancel \}) => \{\
    const \{ isDarkMode \} = useAppContext();\
    \
    const [formData, setFormData] = useState(\{ id: item.id, name: 'name' in item ? item.name : '', description: 'description' in item ? item.description : '' \});\
    const [stringifiedDisciplines, setStringifiedDisciplines] = useState(() => \{\
        const initialDisciplines: \{ [key: string]: string \} = \{\};\
        Object.entries(item.disciplines).forEach(([key, value]) => \{\
            initialDisciplines[key] = JSON.stringify(value, null, 2);\
        \});\
        return initialDisciplines;\
    \});\
\
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => \{ \
        const \{ name, value \} = e.target; \
        setFormData(prev => (\{ ...prev, [name]: value \})); \
    \};\
    \
    const handleDisciplineChange = (e: React.ChangeEvent<HTMLTextAreaElement>, discipline: string) => \{\
        const \{ value \} = e.target;\
        setStringifiedDisciplines(prev => (\{ ...prev, [discipline]: value \}));\
    \};\
    \
    const handleSubmit = (e: React.FormEvent) => \{\
        e.preventDefault();\
        const disciplines: \{ [key: string]: DisciplineData \} = \{\};\
        try \{\
            for (const key in stringifiedDisciplines) \{\
                disciplines[key] = JSON.parse(stringifiedDisciplines[key]);\
            \}\
            const finalItem = \{\
                ...item,\
                ...formData,\
                disciplines,\
            \};\
            onSave(finalItem);\
        \} catch (err) \{\
             console.error(`Invalid JSON. Please correct it.`);\
             alert(`Error: The data for one of the disciplines is not valid JSON.`);\
             return;\
        \}\
    \};\
\
    const inputClass = isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-black';\
    return (\
        <form onSubmit=\{handleSubmit\} className="p-1 h-full flex flex-col">\
            <div className="flex-grow overflow-y-auto pr-2">\
                <div className="grid grid-cols-2 gap-4 text-sm">\
                    <div><label className="font-semibold block mb-1">ID / Tag</label><input type="text" name="id" value=\{formData.id\} onChange=\{handleChange\} className=\{`w-full p-2 rounded $\{inputClass\}`\} /></div>\
                    \{itemType === 'equipment' && <>\
                        <div><label className="font-semibold block mb-1">Name</label><input type="text" name="name" value=\{formData.name\} onChange=\{handleChange\} className=\{`w-full p-2 rounded $\{inputClass\}`\} /></div>\
                        <div><label className="font-semibold block mb-1">Type</label><input type="text" name="type" value=\{(item as Equipment).type\} className=\{`w-full p-2 rounded $\{inputClass\}`\} disabled /></div>\
                        <div className="col-span-2"><label className="font-semibold block mb-1">Description</label><input type="text" name="description" value=\{formData.description\} onChange=\{handleChange\} className=\{`w-full p-2 rounded $\{inputClass\}`\} /></div>\
                    </>\}\
                </div>\
                <div className="mt-4">\
                    <h4 className="font-semibold mb-2">Disciplines (JSON)</h4>\
                    \{Object.keys(stringifiedDisciplines).map(disc => (\
                        <div key=\{disc\} className="mb-2">\
                            <label className="font-semibold text-sm capitalize">\{disc\}</label>\
                            <textarea name=\{disc\} rows=\{4\} value=\{stringifiedDisciplines[disc]\} onChange=\{(e) => handleDisciplineChange(e, disc)\} className=\{`w-full p-2 rounded text-xs font-mono $\{inputClass\}`\}></textarea>\
                        </div>\
                    ))\}\
                </div>\
            </div>\
            <div className="flex-shrink-0 pt-4 flex gap-2">\
                <button type="submit" className=\{`w-full py-2 font-bold rounded $\{isDarkMode ? 'bg-white text-black hover:bg-gray-300' : 'bg-black text-white hover:bg-gray-800'\}`\}>Save Changes</button>\
                <button type="button" onClick=\{onCancel\} className="w-1/2 py-2 font-bold rounded bg-gray-500 text-white hover:bg-gray-600">Cancel</button>\
            </div>\
        </form>\
    );\
\};\
\
// --- ESTIMATING MODULE ---\
const EstimatingModule: FC = () => \{\
    const \{ equipment, isDarkMode \} = useAppContext();\
    const [estimates, setEstimates] = useState<CostEstimate[]>([]);\
    const [isLoading, setIsLoading] = useState(false);\
    const [error, setError] = useState<string | null>(null);\
\
    const getNativeCostEstimate = (equipmentList: \{ tag: string, description: string, type: string \}[]): Promise<\{ estimates: CostEstimate[] \}> => \{\
        return new Promise(resolve => \{\
            setTimeout(() => \{\
                const costEstimates = equipmentList.map(eq => \{\
                    let baseCost = 50000; // Default base cost\
                    if (eq.type.includes('Tank') || eq.type.includes('Column')) baseCost = 250000;\
                    if (eq.type.includes('Reactor') || eq.type.includes('Exchanger')) baseCost = 150000;\
                    if (eq.type.includes('Pump') || eq.type.includes('Compressor')) baseCost = 75000;\
                    \
                    const equipmentCost = Math.round(baseCost * (Math.random() * 0.4 + 0.8));\
                    const installationLabor = Math.round(equipmentCost * 0.4 * (Math.random() * 0.5 + 0.75));\
                    const pipingMaterials = Math.round(equipmentCost * 0.3 * (Math.random() * 0.5 + 0.75));\
                    const instrumentation = Math.round(equipmentCost * 0.2 * (Math.random() * 0.5 + 0.75));\
                    const total = equipmentCost + installationLabor + pipingMaterials + instrumentation;\
                    \
                    return \{ tag: eq.tag, description: eq.description, equipmentCost, installationLabor, pipingMaterials, instrumentation, total \};\
                \});\
                resolve(\{ estimates: costEstimates \});\
            \}, 1500);\
        \});\
    \};\
\
    const handleGenerateEstimate = useCallback(async () => \{\
        setIsLoading(true);\
        setError(null);\
        try \{\
            const equipmentList = Object.values(equipment).map(e => (\{ tag: e.id, description: e.description, type: e.type \}));\
            const result = await getNativeCostEstimate(equipmentList);\
            setEstimates(result.estimates);\
        \} catch (err: any) \{\
            setError(err.message);\
        \} finally \{\
            setIsLoading(false);\
        \}\
    \}, [equipment]);\
    \
    const totalCost = useMemo(() => \{\
        return estimates.reduce((acc, item) => acc + item.total, 0);\
    \}, [estimates]);\
\
    const formatCurrency = (value: number) => \{\
        return new Intl.NumberFormat('en-US', \{ style: 'currency', currency: 'USD' \}).format(value);\
    \};\
    \
    const containerBg = isDarkMode ? 'bg-black' : 'bg-gray-50';\
    const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';\
    const tableHeaderBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';\
    const tableRowBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';\
    const buttonClass = isDarkMode \
        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' \
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300';\
\
    return (\
        <div className=\{`w-full h-full p-6 $\{containerBg\} $\{textPrimary\}`\}>\
            <div className="flex justify-between items-center mb-6">\
                <h1 className="text-2xl font-bold">Capital Cost Estimate</h1>\
                <button\
                    onClick=\{handleGenerateEstimate\}\
                    disabled=\{isLoading\}\
                    className=\{`px-4 py-2 font-semibold rounded-md transition-colors flex items-center justify-center gap-2 $\{buttonClass\} disabled:opacity-50 disabled:cursor-not-allowed`\}\
                >\
                    \{isLoading ? 'Generating...' : '\uc0\u10024  Generate Cost Estimate'\}\
                </button>\
            </div>\
\
            \{error && <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4">\{error\}</div>\}\
\
            <div className="overflow-auto">\
                <table className="w-full text-sm text-left">\
                    <thead className=\{`$\{tableHeaderBg\} text-xs uppercase`\}>\
                        <tr>\
                            <th className="px-6 py-3">Tag</th>\
                            <th className="px-6 py-3">Description</th>\
                            <th className="px-6 py-3 text-right">Equipment Cost</th>\
                            <th className="px-6 py-3 text-right">Installation</th>\
                            <th className="px-6 py-3 text-right">Piping & Materials</th>\
                            <th className="px-6 py-3 text-right">Instrumentation</th>\
                            <th className="px-6 py-3 text-right">Total</th>\
                        </tr>\
                    </thead>\
                    <tbody>\
                        \{estimates.map(item => (\
                            <tr key=\{item.tag\} className=\{`border-b $\{tableRowBorder\}`\}>\
                                <td className="px-6 py-4 font-bold">\{item.tag\}</td>\
                                <td className="px-6 py-4">\{item.description\}</td>\
                                <td className="px-6 py-4 text-right">\{formatCurrency(item.equipmentCost)\}</td>\
                                <td className="px-6 py-4 text-right">\{formatCurrency(item.installationLabor)\}</td>\
                                <td className="px-6 py-4 text-right">\{formatCurrency(item.pipingMaterials)\}</td>\
                                <td className="px-6 py-4 text-right">\{formatCurrency(item.instrumentation)\}</td>\
                                <td className="px-6 py-4 text-right font-bold">\{formatCurrency(item.total)\}</td>\
                            </tr>\
                        ))\}\
                    </tbody>\
                    <tfoot>\
                        <tr className=\{`$\{tableHeaderBg\} font-bold`\}>\
                            <td colSpan=\{6\} className="px-6 py-4 text-right text-lg">Total Estimated Cost</td>\
                            <td className="px-6 py-4 text-right text-lg">\{formatCurrency(totalCost)\}</td>\
                        </tr>\
                    </tfoot>\
                </table>\
            </div>\
\
        </div>\
    );\
\};\
\
\
// --- MAIN APP COMPONENT ---\
\
const AppContent: FC = () => \{\
    const \{ isLoading, currentModule, isDarkMode \} = useAppContext();\
    const mainBgClass = isDarkMode ? 'bg-black' : 'bg-white';\
    \
    if (isLoading) return <><GlobalStyles /><LoadingScreen /></>;\
\
    return (\
        <div className=\{`h-screen flex flex-col transition-colors duration-300 $\{mainBgClass\}`\} style=\{\{fontFamily: "'Space Grotesk', sans-serif"\}\}>\
            <GlobalStyles />\
            <Header />\
            <main className="flex-grow flex relative overflow-hidden pt-16">\
                \{currentModule === 'Engineering' && <EngineeringModule />\}\
                \{currentModule === 'Project Management' && <ProjectManagementModule />\}\
                \{currentModule === 'Estimating' && <EstimatingModule />\}\
                \{['Procurement', 'Construction'].includes(currentModule) && <div className=\{`flex-grow flex items-center justify-center $\{mainBgClass\} $\{isDarkMode ? 'text-gray-600' : 'text-gray-400'\}`\}>\{currentModule\} Module Coming Soon</div>\}\
            </main>\
            <DetailsPane />\
        </div>\
    );\
\};\
\
export default function App() \{\
    return (\
        <AppProvider>\
            <AppContent />\
        </AppProvider>\
    );\
\}\
}