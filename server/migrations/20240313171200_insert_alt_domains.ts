import { Knex } from "knex";
import env from "../env";

export async function up(knex: Knex): Promise<any> {
  const domains = await knex("domains").select("address");
  const altDomains = [];
  if(env.NEXT_PUBLIC_ALT_DOMAINS.includes(",")) {
    altDomains.push(env.NEXT_PUBLIC_ALT_DOMAINS.split(","));
  } else if (env.NEXT_PUBLIC_ALT_DOMAINS != "" && env.NEXT_PUBLIC_ALT_DOMAINS !== null) {
    altDomains.push(env.NEXT_PUBLIC_ALT_DOMAINS);
  }
  if (altDomains.length > 0) {
    for (const altDomain in altDomains) {
        if (!domains.includes(altDomain)) {
            await knex("domains").insert({address: altDomains[altDomain]});
        }
    }
  }
}

export async function down(): Promise<any> {
  return null;
}
