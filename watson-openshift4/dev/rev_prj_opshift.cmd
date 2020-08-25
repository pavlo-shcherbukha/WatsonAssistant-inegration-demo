echo ****************************************
echo * Забрать права на проект   
echo ****************************************



oc adm policy remove-role-from-user admin username -n %PRJ-NAME%
