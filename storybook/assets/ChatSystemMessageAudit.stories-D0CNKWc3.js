import{i as e}from"./preload-helper-CT_b8DTk.js";import{t}from"./jsx-runtime-DqZldVDK.js";import{t as n}from"./Icon-D2oBWIMj.js";import{t as r}from"./Icon-ZgagTqjc.js";import{di as i,ei as a,yi as o}from"./iframe-TnfmppJz.js";var s,c,l,u,d,f;e((()=>{a(),r(),s=t(),c=`Messages are end-to-end encrypted for everyone in this conversation and on every signed-in device.`,l={title:`a11y/ChatSystemMessage audit`,component:i,args:{children:`Conversation started`},tags:[`no-visual`],parameters:{docs:{description:{component:`Single-subject fixtures for exact-head ChatSystemMessage audit evidence. The dedicated namespace is excluded from stable visual baselines and explicitly routed to the component accessibility owner.`}}}},u={render:()=>(0,s.jsxs)(`div`,{style:{display:`grid`,gap:24,width:480,maxWidth:`100%`},children:[(0,s.jsx)(i,{"data-system-message-case":`default`,children:`Conversation started`}),(0,s.jsx)(i,{"data-system-message-case":`default-icon`,icon:(0,s.jsx)(n,{icon:`info`,size:`sm`}),children:`Messages are end-to-end encrypted`}),(0,s.jsx)(i,{"data-system-message-case":`divider`,variant:`divider`,children:`Today`}),(0,s.jsx)(i,{"data-system-message-case":`divider-icon`,icon:(0,s.jsx)(n,{icon:`info`,size:`sm`}),variant:`divider`,children:`March 15, 2026`}),(0,s.jsx)(o,{align:`top`,children:(0,s.jsx)(i,{"data-system-message-case":`nested-log`,children:`Conversation archived`})})]})},d={render:()=>(0,s.jsxs)(`div`,{style:{display:`grid`,gap:24,gridTemplateColumns:`minmax(0, 1fr)`,width:280,maxWidth:`100%`},children:[(0,s.jsx)(i,{"data-system-message-case":`narrow-default`,icon:(0,s.jsx)(n,{icon:`info`,size:`sm`}),children:`Conversation marked as resolved`}),(0,s.jsx)(i,{"data-system-message-case":`narrow-divider`,variant:`divider`,children:`March 15, 2026`}),(0,s.jsx)(i,{"data-system-message-case":`long-default`,icon:(0,s.jsx)(n,{icon:`info`,size:`sm`}),children:c})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: 24,
    width: 480,
    maxWidth: '100%'
  }}>
      <ChatSystemMessage data-system-message-case="default">
        Conversation started
      </ChatSystemMessage>
      <ChatSystemMessage data-system-message-case="default-icon" icon={<Icon icon="info" size="sm" />}>
        Messages are end-to-end encrypted
      </ChatSystemMessage>
      <ChatSystemMessage data-system-message-case="divider" variant="divider">
        Today
      </ChatSystemMessage>
      <ChatSystemMessage data-system-message-case="divider-icon" icon={<Icon icon="info" size="sm" />} variant="divider">
        March 15, 2026
      </ChatSystemMessage>
      <ChatMessageList align="top">
        <ChatSystemMessage data-system-message-case="nested-log">
          Conversation archived
        </ChatSystemMessage>
      </ChatMessageList>
    </div>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: 24,
    gridTemplateColumns: 'minmax(0, 1fr)',
    width: 280,
    maxWidth: '100%'
  }}>
      <ChatSystemMessage data-system-message-case="narrow-default" icon={<Icon icon="info" size="sm" />}>
        Conversation marked as resolved
      </ChatSystemMessage>
      <ChatSystemMessage data-system-message-case="narrow-divider" variant="divider">
        March 15, 2026
      </ChatSystemMessage>
      <ChatSystemMessage data-system-message-case="long-default" icon={<Icon icon="info" size="sm" />}>
        {LONG_SYSTEM_MESSAGE}
      </ChatSystemMessage>
    </div>
}`,...d.parameters?.docs?.source}}},f=[`States`,`Narrow`]}))();export{d as Narrow,u as States,f as __namedExportsOrder,l as default};