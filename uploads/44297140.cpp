#include <bits/stdc++.h>
using namespace std;

int main() {int t;cin>>t;
while(t--){ int N,M; cin>>N>>M;int count =1;
           int A[N];int i,j,k;
                for(i=0;i<N;i++)
                  cin>>A[i];
                 sort(A,A+N); 
                 for(i=0;i<N-1;i++)
                  {if(A[i]!=A[i+1])count ++;}
                   if(count<M) cout<<"YES"<<endl;
                   else cout<<"No"<<endl;}
                   
	// your code goes here
	return 0;}
