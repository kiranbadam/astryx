import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./react-B7Te67-h.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{n as i,t as a}from"./CodeBlock-26Gr3vpE.js";import{ei as o,li as s}from"./iframe-TnfmppJz.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;e((()=>{o(),c=t(n()),a(),l=r(),{expect:u,userEvent:d}=__STORYBOOK_MODULE_TEST__,f={title:`Core/ChatToolCalls`,component:s,tags:[`autodocs`],parameters:{layout:`centered`},decorators:[e=>(0,l.jsx)(`div`,{style:{width:500,padding:40},children:(0,l.jsx)(e,{})})]},p={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`git status`,status:`complete`,duration:`1.2s`}]})},m={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`git diff --stat`,status:`complete`,duration:`340ms`},{name:`read`,target:`src/Button.tsx`,status:`complete`,duration:`45ms`},{name:`edit`,target:`src/Button.tsx`,status:`complete`,duration:`120ms`,additions:12,deletions:3}]})},h={render:()=>(0,l.jsx)(s,{label:`Repository updates`,defaultIsExpanded:!0,calls:[{name:`read`,target:`package.json`,status:`complete`},{name:`edit`,target:`package.json`,status:`complete`}]})},g={tags:[`no-visual`],render:()=>(0,l.jsx)(s,{defaultIsExpanded:!0,calls:[{name:`read`,target:`package.json`,status:`complete`,resultDetail:(0,l.jsx)(i,{code:`{"name":"astryx"}`,language:`json`})},{name:`edit`,target:`package.json`,status:`complete`}]}),play:async({canvasElement:e})=>{document.activeElement instanceof HTMLElement&&document.activeElement.blur(),await d.tab(),await d.tab();let t=e.querySelector(`:focus`);await u(t).not.toBeNull(),await u(t).toHaveTextContent(`read`);let n=getComputedStyle(t);await u(Number.parseFloat(n.outlineWidth)).toBeGreaterThanOrEqual(2),await u(Number.parseFloat(n.outlineOffset)).toBeLessThanOrEqual(-2)}},_={tags:[`no-visual`],render:()=>(0,l.jsx)(`div`,{"data-chat-tool-calls-narrow":!0,style:{boxSizing:`border-box`,width:320,padding:16},children:(0,l.jsx)(s,{calls:[{name:`long_running_tool_name`,target:`packages/core/src/Chat/ChatToolCalls.tsx`,status:`running`,node:`workspace`}]})}),play:async({canvasElement:e})=>{let t=e.querySelector(`[data-chat-tool-calls-narrow]`);if(await u(t).not.toBeNull(),t==null)throw Error(`Expected the narrow ChatToolCalls fixture`);await u(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth)}},v={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`yarn test`,status:`complete`,duration:`4.2s`,node:`cli:remote-server`},{name:`bash`,target:`yarn build`,status:`complete`,duration:`12s`,node:`cli:remote-server`},{name:`read`,target:`README.md`,status:`complete`,duration:`30ms`,node:`workspace`},{name:`web_search`,target:`CSS anchor positioning`,status:`complete`,duration:`1.8s`}]})},y={render:()=>(0,l.jsx)(s,{calls:[{name:`edit`,target:`Button.tsx`,status:`complete`,duration:`85ms`,node:`cli:remote-server`,additions:24,deletions:8},{name:`edit`,target:`Button.test.tsx`,status:`complete`,duration:`60ms`,node:`cli:remote-server`,additions:45},{name:`bash`,target:`grep -r "radius"`,status:`complete`,duration:`200ms`,node:`cli:remote-server`,stats:`6 files · 14 matches`}]})},b={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`yarn build`,status:`complete`,duration:`8s`,node:`cli:remote-server`},{name:`read`,target:`test-output.log`,status:`complete`,duration:`15ms`,node:`cli:remote-server`},{name:`bash`,target:`yarn test`,status:`error`,duration:`2.1s`,node:`cli:remote-server`,errorMessage:`Process exited with code 1: FAIL src/Button.test.tsx`}]})},x={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`yarn test --watch`,status:`running`,node:`cli:remote-server`},{name:`read`,target:`vitest.config.ts`,status:`complete`,duration:`20ms`,node:`cli:remote-server`}]})},S={render:()=>{let e=[{key:`1`,name:`web_search`,target:`CSS anchor positioning support`,status:`complete`,duration:`1.8s`},{key:`2`,name:`read`,target:`packages/core/src/Layer/useLayer.tsx`,status:`complete`,duration:`45ms`,node:`cli:remote-server`},{key:`3`,name:`bash`,target:`npx tsc --noEmit`,status:`complete`,duration:`4.2s`,node:`cli:remote-server`},{key:`4`,name:`edit`,target:`ChatComposer.tsx`,status:`complete`,duration:`120ms`,node:`cli:remote-server`,additions:8,deletions:2},{key:`5`,name:`bash`,target:`yarn test`,status:`complete`,duration:`6.1s`,node:`cli:remote-server`}],[t,n]=(0,c.useState)([]),[r,i]=(0,c.useState)(!1);return(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16},children:[(0,l.jsx)(`button`,{onClick:(0,c.useCallback)(()=>{n([]),i(!0);let t=0,r=()=>{if(t>=e.length){i(!1);return}let a=e[t];if(a==null)return;n(e=>[...e,{...a,status:`running`,duration:void 0}]);let o=t;setTimeout(()=>{n(t=>t.map((t,n)=>n===o?{...e[o]??t}:t)),setTimeout(r,200)},800+Math.random()*1200),t++};r()},[]),disabled:r,style:{padding:`8px 16px`,borderRadius:8,border:`1px solid #ccc`,cursor:r?`not-allowed`:`pointer`,opacity:r?.5:1},children:r?`Running...`:`Start streaming`}),t.length>0&&(0,l.jsx)(s,{calls:t})]})}},C={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`git fetch origin`,status:`complete`,duration:`1.2s`},{name:`bash`,target:`git log --oneline -5`,status:`complete`,duration:`80ms`},{name:`read`,target:`CHANGELOG.md`,status:`complete`,duration:`30ms`},{name:`read`,target:`package.json`,status:`complete`,duration:`15ms`},{name:`edit`,target:`package.json`,status:`complete`,duration:`50ms`,additions:1,deletions:1},{name:`bash`,target:`yarn install`,status:`complete`,duration:`8.5s`},{name:`bash`,target:`yarn build`,status:`complete`,duration:`12s`},{name:`bash`,target:`yarn test`,status:`complete`,duration:`6.2s`}]})},w={render:()=>(0,l.jsx)(s,{calls:[{name:`edit`,target:`Button.tsx`,status:`complete`,duration:`85ms`,node:`cli:remote-server`,additions:12,deletions:3,resultDetail:(0,l.jsx)(i,{code:`--- a/packages/core/src/Button/Button.tsx
+++ b/packages/core/src/Button/Button.tsx
@@ -55,7 +55,7 @@ const styles = stylex.create({
     gap: spacingVars['--spacing-2'],
     paddingBlock: spacingVars['--spacing-2'],
     paddingInline: spacingVars['--spacing-3'],
-    '--button-radius': radiusVars['--radius-element'],
-    borderRadius: 'var(--button-radius)',
+    borderRadius: 'var(--button-radius, var(--radius-element))',
     fontFamily: 'inherit',
     fontSize: typeScaleVars['--text-label-size'],
     lineHeight: typeScaleVars['--text-label-leading'],
@@ -93,6 +93,10 @@ const styles = stylex.create({
     '--button-icon-only-aspect': '1 / 1',
     aspectRatio: 'var(--button-icon-only-aspect)',
   },
+  // Focus ring offset for accessibility
+  focusVisible: {
+    outline: '2px solid var(--color-ring-focus)',
+    outlineOffset: '2px',
+  },
 });`,language:`typescript`,maxHeight:`50vh`})},{name:`bash`,target:`yarn test`,status:`complete`,duration:`6.1s`,node:`cli:remote-server`,resultDetail:(0,l.jsx)(i,{code:`$ yarn test
 PASS  packages/core/src/Button/Button.test.tsx
 PASS  packages/core/src/Chat/ChatToolCalls.test.tsx
 PASS  packages/core/src/Chat/ChatComposerInput.test.tsx

Test Suites: 7 passed, 7 total
Tests:       67 passed, 67 total
Time:        6.1s`,language:`bash`,maxHeight:`50vh`})},{name:`web_search`,target:`CSS anchor positioning`,status:`complete`,duration:`1.8s`}]})},T={render:()=>(0,l.jsx)(s,{calls:[{name:`bash`,target:`yarn build`,status:`complete`,duration:`8s`,node:`cli:remote-server`},{name:`read`,target:`ChatToolCalls.tsx`,status:`complete`,duration:`15ms`,node:`cli:remote-server`},{name:`bash`,target:`yarn test`,status:`error`,duration:`6.8s`,node:`cli:remote-server`,errorMessage:`4 tests failed`,resultDetail:(0,l.jsx)(i,{code:`$ yarn test
 PASS  packages/core/src/Chat/ChatReasoning.test.tsx (7 tests)
 FAIL  packages/core/src/Chat/ChatToolCalls.test.tsx

  ● ChatToolCalls > renders group header for multiple calls

    ReferenceError: hasError is not defined

Test Suites: 1 failed, 6 passed, 7 total
Tests:       4 failed, 63 passed, 67 total
Time:        6.84s`,language:`bash`,maxHeight:`50vh`})}]})},E={render:()=>(0,l.jsx)(s,{calls:[{key:`pending`,name:`bash`,target:`yarn build`,status:`pending`},{key:`running`,name:`bash`,target:`yarn test`,status:`running`},{key:`complete`,name:`edit`,target:`Button.tsx`,status:`complete`,duration:`120ms`,additions:8,deletions:2},{key:`error`,name:`bash`,target:`yarn lint`,status:`error`,duration:`0.8s`,errorMessage:`3 lint errors found`}]})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'bash',
    target: 'git status',
    status: 'complete',
    duration: '1.2s'
  }]} />
}`,...p.parameters?.docs?.source},description:{story:`Single tool call — renders inline, no group chrome`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'bash',
    target: 'git diff --stat',
    status: 'complete',
    duration: '340ms'
  }, {
    name: 'read',
    target: 'src/Button.tsx',
    status: 'complete',
    duration: '45ms'
  }, {
    name: 'edit',
    target: 'src/Button.tsx',
    status: 'complete',
    duration: '120ms',
    additions: 12,
    deletions: 3
  }]} />
}`,...m.parameters?.docs?.source},description:{story:`Multiple calls — pile visual with collapsible group`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls label="Repository updates" defaultIsExpanded calls={[{
    name: 'read',
    target: 'package.json',
    status: 'complete'
  }, {
    name: 'edit',
    target: 'package.json',
    status: 'complete'
  }]} />
}`,...h.parameters?.docs?.source},description:{story:`Custom group label — replaces the translated count while expanded`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  tags: ['no-visual'],
  render: () => <ChatToolCalls defaultIsExpanded calls={[{
    name: 'read',
    target: 'package.json',
    status: 'complete',
    resultDetail: <CodeBlock code='{"name":"astryx"}' language="json" />
  }, {
    name: 'edit',
    target: 'package.json',
    status: 'complete'
  }]} />,
  play: async ({
    canvasElement
  }) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    await userEvent.tab();
    await userEvent.tab();
    const focused = canvasElement.querySelector<HTMLElement>(':focus');
    await expect(focused).not.toBeNull();
    await expect(focused).toHaveTextContent('read');
    const style = getComputedStyle(focused as HTMLElement);
    await expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
    await expect(Number.parseFloat(style.outlineOffset)).toBeLessThanOrEqual(-2);
  }
}`,...g.parameters?.docs?.source},description:{story:`Focused grouped detail — proves the inset ring survives the animated clip boundary`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  tags: ['no-visual'],
  render: () => <div data-chat-tool-calls-narrow style={{
    boxSizing: 'border-box',
    width: 320,
    padding: 16
  }}>
      <ChatToolCalls calls={[{
      name: 'long_running_tool_name',
      target: 'packages/core/src/Chat/ChatToolCalls.tsx',
      status: 'running',
      node: 'workspace'
    }]} />
    </div>,
  play: async ({
    canvasElement
  }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-chat-tool-calls-narrow]');
    await expect(container).not.toBeNull();
    if (container == null) {
      throw new Error('Expected the narrow ChatToolCalls fixture');
    }
    await expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth);
  }
}`,..._.parameters?.docs?.source},description:{story:`Narrow container — long metadata truncates without horizontal overflow`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'bash',
    target: 'yarn test',
    status: 'complete',
    duration: '4.2s',
    node: 'cli:remote-server'
  }, {
    name: 'bash',
    target: 'yarn build',
    status: 'complete',
    duration: '12s',
    node: 'cli:remote-server'
  }, {
    name: 'read',
    target: 'README.md',
    status: 'complete',
    duration: '30ms',
    node: 'workspace'
  }, {
    name: 'web_search',
    target: 'CSS anchor positioning',
    status: 'complete',
    duration: '1.8s'
  }]} />
}`,...v.parameters?.docs?.source},description:{story:`With node badges — shows which sandbox ran each tool`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'edit',
    target: 'Button.tsx',
    status: 'complete',
    duration: '85ms',
    node: 'cli:remote-server',
    additions: 24,
    deletions: 8
  }, {
    name: 'edit',
    target: 'Button.test.tsx',
    status: 'complete',
    duration: '60ms',
    node: 'cli:remote-server',
    additions: 45
  }, {
    name: 'bash',
    target: 'grep -r "radius"',
    status: 'complete',
    duration: '200ms',
    node: 'cli:remote-server',
    stats: '6 files · 14 matches'
  }]} />
}`,...y.parameters?.docs?.source},description:{story:`With stats — additions, deletions, file counts`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'bash',
    target: 'yarn build',
    status: 'complete',
    duration: '8s',
    node: 'cli:remote-server'
  }, {
    name: 'read',
    target: 'test-output.log',
    status: 'complete',
    duration: '15ms',
    node: 'cli:remote-server'
  }, {
    name: 'bash',
    target: 'yarn test',
    status: 'error',
    duration: '2.1s',
    node: 'cli:remote-server',
    errorMessage: 'Process exited with code 1: FAIL src/Button.test.tsx'
  }]} />
}`,...b.parameters?.docs?.source},description:{story:`Error state — shows error indicator on group and individual calls`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'bash',
    target: 'yarn test --watch',
    status: 'running',
    node: 'cli:remote-server'
  }, {
    name: 'read',
    target: 'vitest.config.ts',
    status: 'complete',
    duration: '20ms',
    node: 'cli:remote-server'
  }]} />
}`,...x.parameters?.docs?.source},description:{story:`Running state — spinner on active calls`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const allCalls: ChatToolCallItem[] = [{
      key: '1',
      name: 'web_search',
      target: 'CSS anchor positioning support',
      status: 'complete',
      duration: '1.8s'
    }, {
      key: '2',
      name: 'read',
      target: 'packages/core/src/Layer/useLayer.tsx',
      status: 'complete',
      duration: '45ms',
      node: 'cli:remote-server'
    }, {
      key: '3',
      name: 'bash',
      target: 'npx tsc --noEmit',
      status: 'complete',
      duration: '4.2s',
      node: 'cli:remote-server'
    }, {
      key: '4',
      name: 'edit',
      target: 'ChatComposer.tsx',
      status: 'complete',
      duration: '120ms',
      node: 'cli:remote-server',
      additions: 8,
      deletions: 2
    }, {
      key: '5',
      name: 'bash',
      target: 'yarn test',
      status: 'complete',
      duration: '6.1s',
      node: 'cli:remote-server'
    }];
    const [calls, setCalls] = useState<ChatToolCallItem[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const start = useCallback(() => {
      setCalls([]);
      setIsRunning(true);
      let i = 0;
      const addNext = () => {
        if (i >= allCalls.length) {
          setIsRunning(false);
          return;
        }
        // Add as running
        const call = allCalls[i];
        if (call == null) {
          return;
        }
        setCalls(prev => [...prev, {
          ...call,
          status: 'running',
          duration: undefined
        }]);

        // Complete after a delay
        const idx = i;
        setTimeout(() => {
          setCalls(prev => prev.map((c, j) => j === idx ? {
            ...(allCalls[idx] ?? c)
          } : c));
          // Add next after completion
          setTimeout(addNext, 200);
        }, 800 + Math.random() * 1200);
        i++;
      };
      addNext();
    }, []);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
        <button onClick={start} disabled={isRunning} style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid #ccc',
        cursor: isRunning ? 'not-allowed' : 'pointer',
        opacity: isRunning ? 0.5 : 1
      }}>
          {isRunning ? 'Running...' : 'Start streaming'}
        </button>
        {calls.length > 0 && <ChatToolCalls calls={calls} />}
      </div>;
  }
}`,...S.parameters?.docs?.source},description:{story:`Streaming — tool calls arrive one by one with status transitions`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    name: 'bash',
    target: 'git fetch origin',
    status: 'complete',
    duration: '1.2s'
  }, {
    name: 'bash',
    target: 'git log --oneline -5',
    status: 'complete',
    duration: '80ms'
  }, {
    name: 'read',
    target: 'CHANGELOG.md',
    status: 'complete',
    duration: '30ms'
  }, {
    name: 'read',
    target: 'package.json',
    status: 'complete',
    duration: '15ms'
  }, {
    name: 'edit',
    target: 'package.json',
    status: 'complete',
    duration: '50ms',
    additions: 1,
    deletions: 1
  }, {
    name: 'bash',
    target: 'yarn install',
    status: 'complete',
    duration: '8.5s'
  }, {
    name: 'bash',
    target: 'yarn build',
    status: 'complete',
    duration: '12s'
  }, {
    name: 'bash',
    target: 'yarn test',
    status: 'complete',
    duration: '6.2s'
  }]} />
}`,...C.parameters?.docs?.source},description:{story:`Many calls — auto-collapses when >3`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const editDiff = \`--- a/packages/core/src/Button/Button.tsx
+++ b/packages/core/src/Button/Button.tsx
@@ -55,7 +55,7 @@ const styles = stylex.create({
     gap: spacingVars['--spacing-2'],
     paddingBlock: spacingVars['--spacing-2'],
     paddingInline: spacingVars['--spacing-3'],
-    '--button-radius': radiusVars['--radius-element'],
-    borderRadius: 'var(--button-radius)',
+    borderRadius: 'var(--button-radius, var(--radius-element))',
     fontFamily: 'inherit',
     fontSize: typeScaleVars['--text-label-size'],
     lineHeight: typeScaleVars['--text-label-leading'],
@@ -93,6 +93,10 @@ const styles = stylex.create({
     '--button-icon-only-aspect': '1 / 1',
     aspectRatio: 'var(--button-icon-only-aspect)',
   },
+  // Focus ring offset for accessibility
+  focusVisible: {
+    outline: '2px solid var(--color-ring-focus)',
+    outlineOffset: '2px',
+  },
 });\`;
    const testOutput = \`$ yarn test
 PASS  packages/core/src/Button/Button.test.tsx
 PASS  packages/core/src/Chat/ChatToolCalls.test.tsx
 PASS  packages/core/src/Chat/ChatComposerInput.test.tsx

Test Suites: 7 passed, 7 total
Tests:       67 passed, 67 total
Time:        6.1s\`;
    return <ChatToolCalls calls={[{
      name: 'edit',
      target: 'Button.tsx',
      status: 'complete',
      duration: '85ms',
      node: 'cli:remote-server',
      additions: 12,
      deletions: 3,
      resultDetail: <CodeBlock code={editDiff} language="typescript" maxHeight="50vh" />
    }, {
      name: 'bash',
      target: 'yarn test',
      status: 'complete',
      duration: '6.1s',
      node: 'cli:remote-server',
      resultDetail: <CodeBlock code={testOutput} language="bash" maxHeight="50vh" />
    }, {
      name: 'web_search',
      target: 'CSS anchor positioning',
      status: 'complete',
      duration: '1.8s'
    }]} />;
  }
}`,...w.parameters?.docs?.source},description:{story:`Interactive calls — edit opens a diff modal, bash opens output`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const errorOutput = \`$ yarn test
 PASS  packages/core/src/Chat/ChatReasoning.test.tsx (7 tests)
 FAIL  packages/core/src/Chat/ChatToolCalls.test.tsx

  ● ChatToolCalls > renders group header for multiple calls

    ReferenceError: hasError is not defined

Test Suites: 1 failed, 6 passed, 7 total
Tests:       4 failed, 63 passed, 67 total
Time:        6.84s\`;
    return <ChatToolCalls calls={[{
      name: 'bash',
      target: 'yarn build',
      status: 'complete',
      duration: '8s',
      node: 'cli:remote-server'
    }, {
      name: 'read',
      target: 'ChatToolCalls.tsx',
      status: 'complete',
      duration: '15ms',
      node: 'cli:remote-server'
    }, {
      name: 'bash',
      target: 'yarn test',
      status: 'error',
      duration: '6.8s',
      node: 'cli:remote-server',
      errorMessage: '4 tests failed',
      resultDetail: <CodeBlock code={errorOutput} language="bash" maxHeight="50vh" />
    }]} />;
  }
}`,...T.parameters?.docs?.source},description:{story:`Error with modal — clicking a failed call shows error detail with banner`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => <ChatToolCalls calls={[{
    key: 'pending',
    name: 'bash',
    target: 'yarn build',
    status: 'pending'
  }, {
    key: 'running',
    name: 'bash',
    target: 'yarn test',
    status: 'running'
  }, {
    key: 'complete',
    name: 'edit',
    target: 'Button.tsx',
    status: 'complete',
    duration: '120ms',
    additions: 8,
    deletions: 2
  }, {
    key: 'error',
    name: 'bash',
    target: 'yarn lint',
    status: 'error',
    duration: '0.8s',
    errorMessage: '3 lint errors found'
  }]} />
}`,...E.parameters?.docs?.source},description:{story:`All statuses — shows every status icon treatment side by side`,...E.parameters?.docs?.description}}},D=[`SingleCall`,`MultipleCalls`,`CustomLabel`,`FocusedGroupedDetail`,`Narrow`,`WithNodes`,`WithStats`,`WithErrors`,`Running`,`Streaming`,`ManyCalls`,`Interactive`,`ErrorWithDetail`,`AllStatuses`]}))();export{E as AllStatuses,h as CustomLabel,T as ErrorWithDetail,g as FocusedGroupedDetail,w as Interactive,C as ManyCalls,m as MultipleCalls,_ as Narrow,x as Running,p as SingleCall,S as Streaming,b as WithErrors,v as WithNodes,y as WithStats,D as __namedExportsOrder,f as default};