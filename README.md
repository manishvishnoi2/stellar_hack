# stellar_hack: A demo application to show how a githubs commits can be managed

### What it does?
This application provides an assurance to developers that they'll get paid if the employer uses their work.

### How it is done?
The application makes use of horizon-testnetwork apis of stellar to observe the transaction of money and provide security as well. Whenever an Employer posts an issue, the money is transferred to the third party distributor and when he merges the work of developer, the transferred money will be delievered to the developer.

### Components
*Employer:* This is the component for Employer to post the issue.

*Developer:* This component enables developers to check for issues and add the work related to it.

In both components, stellar-sdk plays the valid role of transferring money (Lumen).
