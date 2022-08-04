# Project Galaxy NFT Subgraph
> Currently support ethereum, bsc and polygon chain.

* **Mainnet**: https://thegraph.com/hosted-service/subgraph/projectgalaxyhq/project-galaxy-nft-mainnet

* **BNB Chain**: https://thegraph.com/hosted-service/subgraph/projectgalaxyhq/project-galaxy-nft-bsc

* **Polygon**: https://thegraph.com/hosted-service/subgraph/projectgalaxyhq/project-galaxy-nft-polygon

## To setup and deploy

For any of the subgraphs follow below steps

1. Run the `yarn run prepare:[network]` to prepare yaml file from template.yaml and network specific data.
2. Run the `yarn run codegen` command to prepare the TypeScript sources for the GraphQL (generated/schema) and the ABIs (generated/[ABI]/\*).
3. [Optional] run the `yarn run build` command to build the subgraph. Can be used to check compile errors before deploying.
4. Run `graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>`.
5. Deploy via `yarn run deploy:[network]`.
