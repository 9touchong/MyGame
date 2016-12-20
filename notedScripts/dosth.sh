#此shell脚本用于在众多例子脚本中查找某关键字
search_str=baseURL
for t_file in ../phaser-examples-master/examples/*/*js;do
	matched_num=`cat "${t_file}"|grep ${search_str}|wc -l`
	if test ${matched_num} -gt 0
	then
		echo ${t_file} ${matched_num}
	fi
	#echo ${t_file}  `cat "${t_file}"|wc -l`
done
#t_file=../phaser-examples-master/examples/_plugins/CSS3Filters.js
#t_file=../phaser-examples-master/examples/arcade\ physics/angular\ acceleration.js
#echo `cat "${t_file}"|wc -l`
#search_str=sbsbsbs
#echo `cat "${t_file}"|grep ${search_str}|wc -l`
#matched_num=`cat "${t_file}"|grep ${search_str}|wc -l`
#if test ${matched_num} -eq 0
#then
#	echo `cat "${t_file}"|grep ${search_str}|wc -l`
#fi
