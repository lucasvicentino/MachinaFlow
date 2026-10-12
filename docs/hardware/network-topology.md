# Topologia de Rede Industrial e Isolamento de VLANs

A arquitetura de infraestrutura do MachineFlow adota a segregação estrita entre Redes Corporativas (IT) e Redes Operacionais de Campo (OT), em conformidade com as normas ISA/IEC 62443.

---

## 1. Diagrama de Segmentação de Redes

```
                                  INTERNET / WAN
                                        │
                             [ Firewall Corporativo ]
                                        │
               ┌────────────────────────┴────────────────────────┐
               │         VLAN Corporativa / IHM (IT)             │
               │         Sub-rede: 192.168.10.0/24               │
               │                                                 │
               │    [ Operador Web / Tablet / Workstation ]      │
               │              IP: 192.168.10.100                 │
               └────────────────────────┬────────────────────────┘
                                        │ HTTPS (443) / WSS (3001)
                                        ▼
               ┌─────────────────────────────────────────────────┐
               │          GATEWAY / SERVIDOR MACHINEFLOW         │
               │                                                 │
               │   Interface eth0: 192.168.10.10 (IT - Web/API)  │
               │   Interface eth1: 10.0.50.10   (OT - Industrial)│
               └────────────────────────┬────────────────────────┘
                                        │ Modbus TCP (502) / OPC UA (4840)
                                        ▼
               ┌─────────────────────────────────────────────────┐
               │         VLAN Industrial de Campo (OT)           │
               │         Sub-rede: 10.0.50.0/24 (ISOLADA)        │
               │                                                 │
               │    [ CLP Siemens S7-1200 ]   IP: 10.0.50.50     │
               │    [ CLP Schneider M221 ]    IP: 10.0.50.51     │
               │    [ Transmissor PT100 ]     IP: 10.0.50.60     │
               │    [ Simulador Mock ]        IP: 10.0.50.99     │
               └─────────────────────────────────────────────────┘
```

---

## 2. Regras de Firewall e Roteamento

1. **Sem Roteamento Direto entre VLAN IT e VLAN OT:** O servidor MachineFlow atua como ponte de aplicação (*Application Proxy*), não como roteador IP. O tráfego IP corporativo não atinge as portas de campo.
2. **Portas Industriais Confinadas:** As portas `502` e `4840` respondem exclusivamente na interface `eth1` (10.0.50.x).
3. **Bloqueio de Internet em OT:** Os dispositivos da rede industrial não possuem rota padrão (*Default Gateway*) apontando para a internet, eliminando vetores de ataque remoto.

