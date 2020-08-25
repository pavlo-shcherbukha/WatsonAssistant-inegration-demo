echo ****************************************
echo *    create ZIPKIN
echo * 
echo *    ./zipkin.env  - environment file
echo *    docker pull openzipkin/zipkin
echo *   
echo ****************************************

oc delete all -l app=zipkin-wassist
oc new-app --docker-image=openzipkin/zipkin method=new-app --name zipkin-wassist --env-file ./zipkin-wassist.env

echo ****************************************
echo *    create zipkin client Router
echo * 
echo ****************************************


oc expose svc/zipkin-wassist --hostname="zipkin-wassist-%PRJ-NAME%.apps.your.openshift.domain" --name="zipkin-wassist-%PRJ-NAME%.apps.your.openshift.domain" --port 9411
