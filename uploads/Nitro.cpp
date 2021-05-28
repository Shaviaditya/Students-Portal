//Linear Search Program code
#include<stdio.h>
int main(){
    int n;
    printf("Enter the limit of the data structure : ");
    scanf("%d",&n);
    int arr[n];
    printf("Enter the elements of the array :\n");
    for(int k=0;k<n;k++){
        scanf("%d",&arr[k]);
    }
    printf("Enter the value to be searched in the data structure : ");
    int val,i;    scanf("%d",&val);
    for(i=0;i<n;i++){
        if(val==arr[i]){
            printf("%d found at %d position!",(val),(i+1));
            break;
        }
    }
    if(i==n){
        printf("Element not found in the data structure try again");
    }
    printf("\n");
    return 0;
}