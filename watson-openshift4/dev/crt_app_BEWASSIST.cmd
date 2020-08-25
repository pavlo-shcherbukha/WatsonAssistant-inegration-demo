echo ****************************************
echo *    create Watson Assistant BackEnd 
echo * 
echo ****************************************

oc delete all -l app=be-wassist
oc new-app http://*****.git#master --name="be-wassist" --env-file ./be-wassist.env --strategy=source --source-secret=sinc-gitlab-pvx-1 --image-stream=openshift/nodejs:10


echo ****************************************
echo *    create Watson Assistant BackEnd Router
echo *    host: .apps.your.openshift.domain/
echo ****************************************
oc expose svc/be-wassist --hostname="be-wassist-izz000c-bnkdem-dev.apps.your.openshift.domain" --name="be-wassist-izz000c-bnkdem-dev.apps.your.openshift.domain" --port 8080

                                                      