echo ****************************************
echo *    create secret to pravex git lab
echo * 
echo ****************************************

oc create secret generic sinc-gitlab-pvx-1 --from-literal=username=***** --from-literal=password=******

oc secrets link deployer sinc-gitlab-pvx-1  
oc secrets link builder sinc-gitlab-pvx-1

oc annotate secret sinc-gitlab-pvx-1 "build.openshift.io/source-secret-match-uri-1=http://******/*"
