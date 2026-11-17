import test from "node:test";
import assert from "node:assert/strict";
import { TEMPLATES } from "../src/templates.js";
import { blueprint, complexity, readiness, toMarkdown, getTemplate, validateForm, safeProposalSummary } from "../src/core.js";

const base =()=>({
  category:"api",title:"CRM lead sync",goal:"Sync incoming leads securely from our website into the CRM.",users:"Sales department",
  features:["OpenAPI contract","Webhook signature verification","Idempotent requests"],
  integrations:["Stripe","CRM"],customFeatures:"Require employee approval",
  success:"No duplicate contact is created when an event is replayed.",
  platform:"FastAPI on our cloud",timeline:"1–2 months",budget:"Open to discussion",
  migration:"no",constraints:"Personal data with access controls",
  owner:"Company owns CRM and deployment",answers:["Sandbox APIs available","Replayed events ignored","Company owns API tokens"]
});
test("eight real project categories exist",()=>assert.equal(Object.keys(TEMPLATES).length,8));
test("every category has useful evidence",()=>{
  for(const tpl of Object.values(TEMPLATES)){
    assert.ok(tpl.features.length>=8);
    assert.ok(tpl.integrations.length>=5);
    assert.ok(tpl.acceptance.length>=4);
    assert.ok(tpl.questions.length>=3);
    assert.ok(tpl.risks.length>=4);
  }
});
for(const [category,tpl] of Object.entries(TEMPLATES)){
  test(category+" generates category-specific acceptance and risk details",()=>{
    const obj={...base(),category,features:[tpl.features[0]],integrations:[tpl.integrations[0]]};
    const b=blueprint(obj);
    assert.equal(b.category,category);
    assert.equal(b.service,tpl.name);
    assert.equal(b.recommendedTests.length,tpl.acceptance.length);
    assert.equal(b.risks.length,tpl.risks.length);
    assert.deepEqual(b.integrations,[tpl.integrations[0]]);
  });
}
test("valid form produces blueprint",()=>{
  const b=blueprint(base());
  assert.equal(b.category,"api");
  assert.equal(b.milestones.length,4);
  assert.equal(b.success,base().success);
  assert.equal(b.title,base().title);
});
test("missing title blocked",()=>{
  assert.ok(validateForm({...base(),title:""}).length>0);
  assert.throws(()=>blueprint({...base(),title:""}));
});
test("very short problem blocked",()=>assert.throws(()=>blueprint({...base(),goal:"fix"})));
test("invalid category blocked",()=>assert.throws(()=>blueprint({...base(),category:"unknown"})));
test("missing fields are surfaced but not mandatory for draft",()=>{
  const b=blueprint({...base(),owner:"",users:"",success:"",platform:"",timeline:"",constraints:""});
  assert.ok(b.readiness.score<100);
  assert.ok(b.missingDecisions.length>=5);
});
test("complete intake receives 100 readiness",()=>assert.equal(readiness(base()).score,100));
test("empty intake receives 0 readiness",()=>assert.equal(readiness({}).score,0));
test("score is always capped",()=>{
  assert.ok(complexity({...base(),features:Array(100).fill("a"),integrations:Array(100).fill("b")}).points<=100);
});
test("complexity increases with integrations",()=>{
  const a=complexity({...base(),integrations:[]}).points;
  const b=complexity({...base(),integrations:["CRM","Stripe"]}).points;
  assert.ok(b>a);
});
test("sensitive constraints add complexity",()=>{
  const a=complexity({...base(),constraints:""}).points;
  const b=complexity({...base(),constraints:"Sensitive payment information"}).points;
  assert.ok(b>a);
});
test("irrelevant category features are not accepted",()=>{
  const b=blueprint({...base(),features:["Fictitious feature",...base().features]});
  assert.ok(!b.features.includes("Fictitious feature"));
});
test("irrelevant integration is ignored",()=>{
  const b=blueprint({...base(),integrations:["Unknown system","CRM"]});
  assert.deepEqual(b.integrations,["CRM"]);
});
test("features deduplicated",()=>{
  const b=blueprint({...base(),features:["OpenAPI contract","OpenAPI contract"]});
  assert.deepEqual(b.features,["OpenAPI contract"]);
});
test("unsafe text is plain data, not remote execution",()=>{
  const b=blueprint({...base(),goal:'<img src=x onerror=alert(1)> Business process must be documented.'});
  assert.ok(b.goal.includes("<img"));
  assert.equal(b.disclaimers[0].includes("no AI model"),true);
});
test("no invented timeline or price",()=>{
  const b=blueprint({...base(),budget:"",timeline:""});
  assert.equal(b.timeline,"Not specified");
  assert.equal(b.budget,"Open to proposals");
  assert.ok(!b.disclaimers.some(x=>x.includes("guaranteed")));
});
test("Markdown includes milestones and acceptance tests",()=>{
  const m=toMarkdown(blueprint(base()));
  assert.match(m,/## Suggested acceptance tests/);
  assert.match(m,/## Delivery phases/);
  assert.match(m,/## Risks to address/);
  assert.match(m,/AT-01/);
});
test("Markdown omits arbitrary raw user heading injection",()=>{
  const md=toMarkdown(blueprint({...base(),goal:"We need to fix the business workflow.\n## Unauthorized heading"}));
  assert.ok(!md.includes("\n## Unauthorized heading"));
});
test("summary is bounded and excludes unanswered discovery details",()=>{
  const b=blueprint({...base(),goal:"A".repeat(5000)});
  const s=safeProposalSummary(b);
  assert.ok(s.length<=7800);
  assert.ok(!s.includes("API tokens available"));
});
test("project category unknown lookup returns null",()=>assert.equal(getTemplate("other"),null));
test("no artificial assurance of profit or quote",()=>{
  const b=blueprint({...base(),category:"mt5",features:["Risk-based lot sizing"],integrations:["MT5"]});
  const md=toMarkdown(b).toLowerCase();
  assert.ok(!md.includes("guaranteed profit"));
  assert.ok(md.includes("not a binding specification"));
});
test("category-specific unanswered questions survive",()=>{
  const b=blueprint({...base(),category:"voice",features:[],integrations:[]});
  assert.ok(b.missingDecisions.some(x=>x.toLowerCase().includes("call")));
});
