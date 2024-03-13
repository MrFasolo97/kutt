import { Knex } from "knex";
import env from "../env";

export async function up(knex: Knex): Promise<any> {
  const tmpDomains = await knex("domains").select("address");
  const domains = [];
  for (const domain in tmpDomains) {
    domains.push(tmpDomains[domain].address);
  }
  const altDomains = [];
  if(env.NEXT_PUBLIC_ALT_DOMAINS.includes(",")) {
    altDomains.push(env.NEXT_PUBLIC_ALT_DOMAINS.split(","));
  } else if (env.NEXT_PUBLIC_ALT_DOMAINS != "" && env.NEXT_PUBLIC_ALT_DOMAINS !== null) {
    altDomains.push(env.NEXT_PUBLIC_ALT_DOMAINS);
  }
  if (altDomains.length > 0) {
    for (const altDomain in altDomains) {
        if (!domains.includes(altDomains[altDomain])) {
            await knex("domains").insert({address: altDomains[altDomain]});
        }
    }
  }
}

export async function down(): Promise<any> {
  return null;
}
