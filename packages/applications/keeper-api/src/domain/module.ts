import { InjectionModule } from "@nodelith/injection";
import { GoogleModule } from "./google/google.module";
import { KeeperModule } from "./keeper/keeper.module";

export const DomainModule = InjectionModule.create() 
DomainModule.useModule(GoogleModule)
DomainModule.useModule(KeeperModule)
