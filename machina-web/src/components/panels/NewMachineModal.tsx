import React, { useState } from 'react';
import { X, Plus, Trash2, Cpu, Factory, Network, CheckCircle2 } from 'lucide-react';
import { MachineProfile, MachineTag } from '@machina/shared';

interface NewMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMachine: (machine: MachineProfile) => Promise<void>;
}

export const NewMachineModal: React.FC<NewMachineModalProps> = ({
  isOpen,
  onClose,
  onSaveMachine
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [manufacturer, setManufacturer] = useState('Siemens');
  const [model, setModel] = useState('S7-1500 (CPU 1516F)');
  const [softwareName, setSoftwareName] = useState('TIA Portal V18 Safety');
  const [protocol, setProtocol] = useState<'Modbus TCP' | 'OPC UA' | 'S7comm' | 'EtherNet/IP'>('Modbus TCP');
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState(7002);
  const [unitId, setUnitId] = useState(1);
  const [notes, setNotes] = useState('');

  // Internal Memory Tags
  const [tags, setTags] = useState<MachineTag[]>([
    {
      id: 'tag-new-1',
      name: 'Status Principal',
      address: 100,
      type: 'HOLDING_REGISTER',
      dataType: 'INT16',
      unit: '',
      access: 'RO',
      description: 'Palavra de status da máquina'
    },
    {
      id: 'tag-new-2',
      name: 'Comando Habilitar',
      address: 10,
      type: 'COIL',
      dataType: 'BOOL',
      access: 'RW',
      description: 'Bobina de partida/habilitação'
    }
  ]);

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const newTag: MachineTag = {
      id: `tag-${Date.now()}`,
      name: `Tag ${tags.length + 1}`,
      address: 100 + tags.length,
      type: 'HOLDING_REGISTER',
      dataType: 'INT16',
      unit: '',
      access: 'RW'
    };
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  const handleUpdateTag = (id: string, field: keyof MachineTag, value: any) => {
    setTags(
      tags.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const newMachine: MachineProfile = {
      id: `mach-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `M-${Date.now().toString().slice(-4)}`,
      manufacturer,
      model,
      softwareName,
      protocol,
      host,
      port: Number(port),
      unitId: Number(unitId),
      status: 'ONLINE',
      notes,
      tags
    };

    try {
      await onSaveMachine(newMachine);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Cadastrar Nova Máquina Integrada
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                  Recurso Industrial
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure os parâmetros internos do software do CLP e o mapa de registradores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Machine Identity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1">
                Nome da Máquina *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Prensa Hidráulica 03"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1">
                Código / Tag do Ativo
              </label>
              <input
                type="text"
                placeholder="Ex: PRESS-03"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Software Interno e Modelo do CLP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-400" />
                Software Interno / Firmware *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: TIA Portal V18, Studio 5000, EcoStruxure"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1">
                Fabricante
              </label>
              <input
                type="text"
                placeholder="Ex: Siemens, Schneider, Rockwell"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1">
              Modelo do Equipamento / CLP
            </label>
            <input
              type="text"
              placeholder="Ex: S7-1500 (CPU 1516F-3), Modicon M241, ControlLogix"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Conexão Industrial */}
          <div className="grid grid-cols-5 gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
            <div>
              <label className="block text-slate-400 text-[10px] font-medium mb-1">Protocolo</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Modbus TCP">Modbus TCP</option>
                <option value="OPC UA">OPC UA</option>
                <option value="S7comm">Siemens S7comm</option>
                <option value="EtherNet/IP">EtherNet/IP</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-slate-400 text-[10px] font-medium mb-1 flex items-center gap-1">
                <Network className="w-2.5 h-2.5 text-indigo-400" />
                Endereço IP do CLP
              </label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-medium mb-1">Porta</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-medium mb-1">Unit ID</label>
              <input
                type="number"
                value={unitId}
                onChange={(e) => setUnitId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-[11px] font-medium mb-1">
              Notas Técnicas / Descrição do Processo
            </label>
            <input
              type="text"
              placeholder="Ex: Responsável pelo ciclo de envase e esteira de entrada"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white focus:outline-none focus:border-purple-500 text-xs"
            />
          </div>

          {/* Tabela de Tags / Registradores de Memória Interna */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="text-purple-400 font-bold">●</span>
                Tabela de Tags e Registradores Internos (Memory Map):
              </span>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-2 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white rounded text-[11px] font-semibold transition flex items-center gap-1 border border-purple-500/40"
              >
                <Plus className="w-3 h-3" /> Adicionar Tag
              </button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <div className="grid grid-cols-12 bg-slate-900/90 px-2 py-1.5 font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <div className="col-span-4">Nome da Tag</div>
                <div className="col-span-3">Tipo</div>
                <div className="col-span-2">Endereço</div>
                <div className="col-span-2">Unidade</div>
                <div className="col-span-1 text-right">Ação</div>
              </div>

              <div className="max-h-36 overflow-y-auto divide-y divide-slate-800/60">
                {tags.map((tag) => (
                  <div key={tag.id} className="grid grid-cols-12 px-2 py-1 items-center gap-1.5 text-xs">
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={tag.name}
                        onChange={(e) => handleUpdateTag(tag.id, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    <div className="col-span-3">
                      <select
                        value={tag.type}
                        onChange={(e) => handleUpdateTag(tag.id, 'type', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-1 py-0.5 text-[10px] text-slate-200 font-mono focus:outline-none"
                      >
                        <option value="HOLDING_REGISTER">Holding Reg</option>
                        <option value="COIL">Coil (Bobina)</option>
                        <option value="INPUT_REGISTER">Input Reg</option>
                        <option value="DISCRETE_INPUT">Discrete In</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        value={tag.address}
                        onChange={(e) => handleUpdateTag(tag.id, 'address', Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Ex: °C, bar"
                        value={tag.unit || ''}
                        onChange={(e) => handleUpdateTag(tag.id, 'unit', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] text-white focus:outline-none focus:border-purple-500 font-mono"
                      />
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded font-bold text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saving ? 'Integrando...' : 'Salvar e Integrar Máquina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
