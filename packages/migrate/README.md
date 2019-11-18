# migrate

## Usage

### migrate up
    const migrate = require('@ohoareau/migrate').default;
    const alreadyDeployed = await myPersonalFunctionToRetrieveAlreadyDeployedDiffByFileNames();
    
    await migrate('/my/dir/containing/diff/files', alreadyDeployed, myContext, 'up'); 

### migrate down
    const migrate = require('@ohoareau/migrate').default;
    const alreadyDeployed = await myPersonalFunctionToRetrieveAlreadyDeployedDiffByFileNames();
    
    await migrate('/my/dir/containing/diff/files', alreadyDeployed, myContext, 'down'); 

### plan up
    const { plan } = require('@ohoareau/migrate');
    const alreadyDeployed = await myPersonalFunctionToRetrieveAlreadyDeployedDiffByFileNames();
    
    const planned = await plan('/my/dir/containing/diff/files', alreadyDeployed, 'up'); // string[] 

### plan down
    const { plan } = require('@ohoareau/migrate');
    const alreadyDeployed = await myPersonalFunctionToRetrieveAlreadyDeployedDiffByFileNames();
    
    const planned = await plan('/my/dir/containing/diff/files', alreadyDeployed, 'down'); // string[] 

