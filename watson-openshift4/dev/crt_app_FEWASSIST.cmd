echo ****************************************
echo *    create Watson Assistant FrontEnd 
echo * 
echo ****************************************

oc delete all -l app=fe-wassist
oc new-app http://*****.git#tz_000002 --name="fe-wassist" --build-env-file ./fe-wassist.env --strategy=source --source-secret=sinc-gitlab-pvx-1 --image-stream=openshift/nodejs:10


echo ****************************************
echo *    create Watson Assistant FronEnd Router
echo *    host: .apps.your.openshift.domain/
echo ****************************************
oc expose svc/fe-wassist --hostname="fe-wassist-izz000c-bnkdem-dev.apps.your.openshift.domain" --name="fe-wassist-izz000c-bnkdem-dev.apps.your.openshift.domain" --port 8080

                                                      