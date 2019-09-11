cd fabric-dev-servers
composer card delete --card PeerAdmin@hlfv1
composer card delete --card admin@tracker
docker rm -f $(docker ps -a -q)
docke rmi $(docker images |grep 'dev')
./startFabric.sh
./createPeerAdminCard.sh
cd ../tracker
#rm *.bna
#composer archive create -t dir -n .
composer network install --card PeerAdmin@hlfv1 --archiveFile ./tracker@0.0.1.bna
composer network start --networkName tracker --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@tracker
composer-rest-server -c admin@tracker -n always -u true -d y
