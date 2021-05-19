document.getElementById("chaxun").onclick = function(){
	Array.from(document.getElementsByClassName("name")) 
        .filter(i => 
            (i.innerText.search(document.getElementById("cx").value)==(-1)))
        .forEach(i => 
            i.parentNode.style = "display:none;");
};
document.getElementById("qk").onclick = function(){
    document.getElementById("cx").value='';
    Array.from(document.getElementsByClassName("name")).forEach(i => i.parentNode.style = "display: table-row;");
}

document.getElementById("xinzeng").onclick = function(){
		document.getElementById("tianjia").style.display="table-row";
};
document.getElementById("qingkong").onclick = function(){
	Array.from(document.getElementsByClassName("tj")).forEach(i => 
		i.value="");
};
function tijiao(){
	let a = Array.from(document.getElementsByClassName("tj"));
		if((parseInt(a[1].value)<0 || 100<parseInt(a[1].value)
			||parseInt(a[2].value)<0 || 100<parseInt(a[2].value)
			||parseInt(a[3].value)<0 || 100<parseInt(a[3].value))||a[0].value==""||a[1].value==""||a[2].value==""||a[3].value==""){
			alert("姓名，成绩不能为空且成绩必须在0~100分之间！");
			return false;
		}
};
Array.from(document.getElementsByClassName("delete_button")).forEach(i=> {
	i.onclick = function(){
		if(confirm("是否删除该数据？")){
		let index = this.getAttribute("data-id");
		window.location.href = '/delete' + index;
	}
	}
});
Array.from(document.getElementsByClassName("update_button")).forEach(i=> {
	i.onclick = function(){
		if(confirm("是否更改该数据？")){
		let index = this.getAttribute("data-id");
		window.location.href = '/update' + index;
	}
	}
});
$(function(){
	$("#nextPage").click(function(){
		$.ajax({
			type:"post",
			url:"/nextpage",
			success:function(data){
				document.getElementById("showdata").innerHTML = data.map((i,index)=>
				`
				<tr>
				<td class="name">${i.name}</td>
				<td>${i.s1}</td>
				<td>${i.s2}</td>
				<td>${i.s3}</td>
				<td>${i.Total_score}</td>
				<td>
					<input data-id=${index} type="button" value="删除" class="delete_button"/>
					<input data-id=${index} type="button" value="更改" class="update_button"/>
				</td>
				</tr>
				`
				).join("")
			}
		})
	})
	
	$("#lastPage").click(function(){
		$.ajax({
			type:"post",
			url:"/lastpage",
			success:function(data){
				document.getElementById("showdata").innerHTML = data.map((i,index)=>
				`
				<tr>
				<td class="name">${i.name}</td>
				<td>${i.s1}</td>
				<td>${i.s2}</td>
				<td>${i.s3}</td>
				<td>${i.Total_score}</td>
				<td>
					<input data-id=${index} type="button" value="删除" class="delete_button"/>
					<input data-id=${index} type="button" value="更改" class="update_button"/>
				</td>
				</tr>
				`
				).join("")
			}
		})
	});
	
});



